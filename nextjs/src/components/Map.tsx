import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import { PMTiles, Protocol } from "pmtiles";
import "maplibre-gl/dist/maplibre-gl.css";
import styles from "@/styles/Home.module.css";
import { maptiler3dGl } from "@/styles/maptiler-3d-gl";
import retrofitFootprints from "../assets/la_buildings_retrofit_footprints.json";
import allRetrofits from "../assets/retrofit_addresses.json";
import missingRetrofits from "../assets/unretrofit_addresses.json";

const vectorStyle = async (file: PMTiles): Promise<any> => {
  let header = await file.getHeader();
  let metadata = await file.getMetadata();
  let layers: any[] = [];

  const newStyle = maptiler3dGl;

  const bounds = [header.minLon, header.minLat, header.maxLon, header.maxLat];

  return {
    ...newStyle,
    version: 8,
    sources: {
      openmaptiles: {
        type: "vector",
        tiles: ["pmtiles://" + file.source.getKey() + "/{z}/{x}/{y}"],
        minzoom: header.minZoom,
        maxzoom: header.maxZoom,
        bounds: bounds,
      },
    },
    glyphs: process.env.NEXT_PUBLIC_URL + "/{fontstack}/{range}.pbf",
    layers: newStyle.layers,
  };
};

function Map() {
  let mapContainerRef = useRef<HTMLDivElement>(null);
  const [showAttributes, setShowAttributes] = useState<boolean>(false);
  const mapFile = new PMTiles(process.env.NEXT_PUBLIC_URL + "/so_cal.pmtiles");
  const mapRef = useRef<maplibregl.Map | null>(null);

  const showAttributesRef = useRef(showAttributes);
  useEffect(() => {
    showAttributesRef.current = showAttributes;
  });

  const toggleShowAttributes = () => {
    setShowAttributes(!showAttributes);
  };

  useEffect(() => {
    let protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    protocol.add(mapFile);

    const map = new maplibregl.Map({
      container: mapContainerRef.current!,
      zoom: 14,
      center: [-118.243683, 34.052235],
      maxBounds: [-118.951721, 32.75004, -117.646374, 34.823302],
      pitch: 30,
      bearing: -0.44200633613297663,
      minZoom: 5,
      style: {
        version: 8,
        sources: {},
        layers: [],
      },
    });

    map.addControl(new maplibregl.NavigationControl({}), "bottom-left");
    map.on("load", function () {
      map.resize;
      map.addSource("allRetrofits", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: allRetrofits.features,
        },
      });
      allRetrofits.features.forEach(function (marker) {
        new maplibregl.Marker()
          .setLngLat(marker.geometry.coordinates)
          .addTo(map);
      });
    });

    const popup = new maplibregl.Popup({
      closeOnClick: true,
    });

    mapRef.current = map;

    map.on("click", (e) => {
      if (!showAttributesRef.current) {
        popup.remove();
        return;
      }
      var bbox = e.point;

      var features = map.queryRenderedFeatures(bbox);
      // ignore basemap
      features = features.filter(
        (feature) => feature.source !== "openmaptiles"
      );

      map.getCanvas().style.cursor = features.length ? "pointer" : "";

      if (!features.length) {
        popup.remove();
      } else {
        popup.setHTML(`<h1>Hello!</h1>`);
        popup.setLngLat(e.lngLat);
        popup.addTo(map);
      }
    });

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    let map = mapRef.current;
    let initStyle = async (map) => {
      if (mapRef.current) {
        let style = await vectorStyle(mapFile);
        map.setStyle(style);
        return style;
      }
    };

    initStyle(map);
  }, []);

  return (
    <div ref={mapContainerRef} className={styles.mapContainer}>
      <div ref={mapContainerRef}></div>
    </div>
  );
}

export default Map;
