import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import { PMTiles, Protocol } from "pmtiles";
import "maplibre-gl/dist/maplibre-gl.css";
import styles from "@/styles/Home.module.css";
import { maptiler3dGl } from "@/styles/maptiler-3d-gl";
import retrofitFootprints from "../assets/230409_retrofit_footprints.json";
import allRetrofits from "../assets/230409_retrofit_addresses.json";
import missingRetrofits from "../assets/unretrofit_addresses.json";
import verificationRetrofits from "../assets/retrofit_verification_addresses.json";

function Map() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapFile = new PMTiles(process.env.NEXT_PUBLIC_URL + "/so_cal.pmtiles");

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
      minZoom: 11,
      maxZoom: 17.9,
      style: {
        version: 8,
        sources: {
          openmaptiles: {
            type: "vector",
            tiles: ["pmtiles://" + mapFile.source.getKey() + "/{z}/{x}/{y}"],
            minzoom: 0,
            maxzoom: 14,
          },
        },
        layers: maptiler3dGl.layers,
        glyphs: process.env.NEXT_PUBLIC_URL + "/{fontstack}/{range}.pbf",
      },
    });
    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl({}), "bottom-left");

    map.on("load", function () {
      map.resize;

      map.addSource("retrofitFootprints", {
        type: "geojson",
        data: {
          ...retrofitFootprints,
        },
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

      const sourceInfo = [
        {
          name: "allRetrofits",
          data: allRetrofits,
          layerId: "all-retrofits",
          color: "#2ab7ca",
        },
        {
          name: "missingRetrofits",
          data: missingRetrofits,
          layerId: "missing-retrofits",
          color: "#fe4a49",
        },
        {
          name: "verificationRetrofits",
          data: verificationRetrofits,
          layerId: "verification-retrofits",
          color: "#fed766",
        },
      ];

      sourceInfo.forEach((source) => {
        map.addSource(source.name, {
          type: "geojson",
          data: {
            ...source.data,
          },
          cluster: true,
          clusterRadius: 50,
        });
      });

      sourceInfo.forEach((source) => {
        map.addLayer({
          id: `${source.layerId}-cluster`,
          type: "circle",
          source: source.name,
          filter: ["has", "point_count"],
          minzoom: 5,
          paint: {
            "circle-color": source.color,
            "circle-radius": [
              "step",
              ["get", "point_count"],
              1,
              1,
              10,
              10,
              10,
              20,
              20,
              25,
              30,
              100,
              35,
            ],
          },
        });

        map.addLayer({
          id: `${source.layerId}-cluster-count`,
          type: 'symbol',
          source: source.name,
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ["Klokantech Noto Sans Regular"],
            'text-size': 12,
          }

        })

        map.addLayer({
          id: `${source.layerId}`,
          type: "circle",
          source: source.name,
          filter: ["!=", "cluster", true],
          paint: {
            "circle-color": source.color,
            "circle-radius": 5,
          },
        });
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div ref={mapContainerRef} className={styles.mapContainer}>
      <div ref={mapContainerRef}></div>
    </div>
  );
}

export default Map;
