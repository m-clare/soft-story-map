import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import { PMTiles, Protocol } from "pmtiles";
import { ExpressionSpecification, LayerSpecification } from "maplibre-gl";
import { Point } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import styles from "../styles/Home.module.css";
import maptiler3dGl from "../assets/maptiler-3d-gl-style.json";
import HUD from "./HUD";

const colorMap: Map<string, string> = new Map([
  ["retrofit", "#2ab7ca"],
  ["not retrofit", "#fe4a49"],
  ["retrofit not required", "#fed766"],
]);

function getFormattedInfo(props: any) {
  if (props.retrofit_status === "retrofit") {
    const typedProps = {
      ...props,
      issue_date: Date.parse(props.issue_date),
      status_date: Date.parse(props.status_date),
    };
    return `<div>
      <h3>${typedProps.address}</h3>
    </div>`;
  }
  if (props.retrofit_status === "not retrofit") {
    return `<div>
      <h3>Matched geocode address: ${props.address}</h3>
    </div>`;
  }
  if (props.retrofit_status === "retrofit not required") {
    return `<div>
      <h3>${props.address}</h3>
    </div>`;
  }
  return null;
}

function createDonutChart(props: any) {
  const offsets = [];
  const counts = [props.retrofit, props.unretrofit, props.retrofitNR];
  let total = 0;
  for (let i = 0; i < counts.length; i++) {
    offsets.push(total);
    total += counts[i];
  }

  const fontSize =
    total > 10000
      ? 20
      : total >= 1000
      ? 18
      : total >= 100
      ? 18
      : total >= 10
      ? 14
      : 10;
  const radius =
    total > 10000
      ? 65
      : total >= 1000
      ? 50
      : total >= 100
      ? 30
      : total >= 10
      ? 20
      : 12;
  const r0 = Math.round(radius * 0.6);
  const w = radius * 2;

  let html =
    '<div><svg width="' +
    w +
    '" height="' +
    w +
    '" viewbox="0 0 ' +
    w +
    " " +
    w +
    '" text-anchor="middle" style="font: ' +
    fontSize +
    'px sans-serif; display: block">';

  for (let i = 0; i < counts.length; i++) {
    html += donutSegment(
      offsets[i] / total,
      (offsets[i] + counts[i]) / total,
      radius,
      r0,
      Array.from(colorMap.values())[i]
    );
  }

  html +=
    '<circle cx="' +
    radius +
    '" cy="' +
    radius +
    '" r="' +
    r0 +
    '" fill="white" opacity="0.7"/><text font-family="Noto Sans" font-weight=700 dominant-baseline="central" transform="translate(' +
    radius +
    ", " +
    radius +
    ')">' +
    total.toLocaleString() +
    "</text></svg></div>";
  const el = document.createElement("div");
  el.innerHTML = html;
  return el.firstChild;
}

function donutSegment(
  start: number,
  end: number,
  r: number,
  r0: number,
  color: string
) {
  if (end - start === 1) end -= 0.00001;
  const a0 = 2 * Math.PI * (start - 0.25);
  const a1 = 2 * Math.PI * (end - 0.25);
  const x0 = Math.cos(a0);
  const y0 = Math.sin(a0);
  const x1 = Math.cos(a1);
  const y1 = Math.sin(a1);
  const largeArc = end - start > 0.5 ? 1 : 0;

  return [
    '<path d="M',
    r + r0 * x0,
    r + r0 * y0,
    "L",
    r + r * x0,
    r + r * y0,
    "A",
    r,
    r,
    0,
    largeArc,
    1,
    r + r * x1,
    r + r * y1,
    "L",
    r + r0 * x1,
    r + r0 * y1,
    "A",
    r0,
    r0,
    0,
    largeArc,
    0,
    r + r0 * x0,
    r + r0 * y0,
    '" fill="' + color + '" opacity="0.7"/>',
  ].join(" ");
}

function MaplibreMap() {
  const [selectedMarkerData, setSelectedMarkerData] = useState({});
  const [allBuildings, setAllBuildings] = useState<object | null>(null);
  const [retrofitFootprints, setFootprints] = useState<object | null>(null);
  const [hudVisible, setHudVisible] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapFile = new PMTiles("/soft-stories/so_cal.pmtiles");

  useEffect(() => {
    async function loadLayer(dataType: string, filename: string) {
      const response = await fetch(`/soft-stories/${filename}`);
      const data = await response.json();
      if (dataType === "allBuildings") setAllBuildings(data);
      if (dataType === "retrofitFootprints") setFootprints(data);
    }

    loadLayer("allBuildings", "allBuildings.json");
    loadLayer("retrofitFootprints", "230409_retrofit_footprints.json");
  }, []);

  useEffect(() => {
    let protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    protocol.add(mapFile);

    const map = new maplibregl.Map({
      container: mapContainerRef.current!,
      center: [-118.243683, 34.052235],
      pitch: 20,
      zoom: 8.6,
      maxBounds: [
        [-120, 32],
        [-116, 36],
      ],
      minZoom: 8.6,
      maxZoom: 19.9,
      style: {
        version: 8,
        sources: {
          openmaptiles: {
            type: "vector",
            tiles: ["pmtiles://" + mapFile.source.getKey() + "/{z}/{x}/{y}"],
            minzoom: 6,
            maxzoom: 14,
          },
        },
        layers: maptiler3dGl.layers as LayerSpecification[],
        glyphs: "/soft-stories/{fontstack}/{range}.pbf",
      },
    });
    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl({}), "bottom-left");

    const retrofit = [
      "==",
      ["get", "retrofit_status"],
      "retrofit",
    ] as ExpressionSpecification;
    const unretrofit = [
      "==",
      ["get", "retrofit_status"],
      "not retrofit",
    ] as ExpressionSpecification;
    const retrofitNR = [
      "==",
      ["get", "retrofit_status"],
      "retrofit not required",
    ] as ExpressionSpecification;

    map.on("load", function () {
      map.resize();

      map.addSource("retrofitFootprints", {
        type: "geojson",
        data: retrofitFootprints,
      });

      map.addLayer(
        {
          id: "matched-footprints",
          type: "fill",
          source: "retrofitFootprints",
          minzoom: 8,
          paint: {
            "fill-color": "#24939e",
            "fill-opacity": 0.8,
          },
        },
        "building-3d"
      );

      map.loadImage("/soft-stories/marker-sdf.png", function (error, image) {
        if (error) throw error;
        map.addImage("custom-marker", image as ImageBitmap, { sdf: true });

        map.addSource("allBuildings", {
          type: "geojson",
          data: allBuildings,
          cluster: true,
          clusterRadius: 80,
          clusterMaxZoom: 14,
          clusterProperties: {
            retrofit: ["+", ["case", retrofit, 1, 0]],
            unretrofit: ["+", ["case", unretrofit, 1, 0]],
            retrofitNR: ["+", ["case", retrofitNR, 1, 0]],
          },
        });

        let markers = {} as any;
        let markersOnScreen = {} as any;

        function updateMarkers() {
          const newMarkers = {} as any;
          const features = map.querySourceFeatures("allBuildings");

          for (let i = 0; i < features.length; i++) {
            const point = features[i].geometry as Point;
            const coords = point.coordinates as [number, number];
            const props = features[i].properties;
            let marker;
            if (!props.cluster) continue;
            const id = props.cluster_id;
            marker = markers[id];
            if (!marker) {
              const el = createDonutChart(props);
              marker = markers[id] = new maplibregl.Marker({
                element: el as HTMLElement,
              }).setLngLat(coords);
            }
            newMarkers[id] = marker;
            if (id && marker && !markersOnScreen[id]) marker.addTo(map);
          }

          for (const id in markersOnScreen) {
            if (!newMarkers[id]) markersOnScreen[id].remove();
          }
          markersOnScreen = newMarkers;
        }

        // after the GeoJSON data is loaded, update markers on the screen and do so on every map move/moveend
        map.on("sourcedata", function (e) {
          if (e.sourceId !== "allBuildings" || !e.isSourceLoaded) return;
          map.on("move", updateMarkers);
          map.on("moveend", updateMarkers);
          updateMarkers();
        });

        map.addLayer({
          id: "building-marker",
          type: "symbol",
          source: "allBuildings",
          filter: ["!=", "cluster", true],
          layout: {
            "icon-image": "custom-marker",
            "icon-size": 0.4,
            "icon-anchor": "bottom",
            "icon-allow-overlap": true,
          },
          paint: {
            "icon-color": [
              "case",
              retrofit,
              colorMap.get("retrofit")!,
              unretrofit,
              colorMap.get("not retrofit")!,
              retrofitNR,
              colorMap.get("retrofit not required")!,
              "#ffffff",
            ],
          },
        });

        map.on("mouseenter", "building-marker", function (e) {
          map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", "building-marker", function (e) {
          map.getCanvas().style.cursor = "";
        });

        map.on("click", function (e) {
          const features = map.queryRenderedFeatures(e.point);
          const feature =
            features.filter(
              (feature) => feature.layer.id === "building-marker"
            )[0] ?? null;
          if (feature) {
            const point = feature.geometry as Point;
            const coords = point.coordinates as [number, number];
            const id = feature.properties.id;
            // const marker = activeMarkers[id] = new maplibregl.Marker({
            //   color: "#3cd070",
            //   scale: 1.4,
            // })
            //   .setLngLat(coords)
            //   .addTo(map);
            setSelectedMarkerData(feature.properties);
            setHudVisible(true);
          } else {
            setSelectedMarkerData({});
            setHudVisible(false);
          }
        });
      });
    });

    return () => {
      map.remove();
    };
    // eslint-disable-next-line
  }, [allBuildings, retrofitFootprints]);

  return (
    <>
      <div ref={mapContainerRef} className={styles.mapContainer}>
        <div ref={mapContainerRef}></div>
      </div>
      {hudVisible && <HUD rawData={selectedMarkerData} />}
    </>
  );
}

export default MaplibreMap;
