import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import { PMTiles, Protocol } from "pmtiles";
import "maplibre-gl/dist/maplibre-gl.css";
import styles from "@/styles/Home.module.css";
import { maptiler3dGl } from "@/styles/maptiler-3d-gl";
import retrofitFootprints from "../assets/230409_retrofit_footprints.json";
import allBuildings from "../assets/allBuildings.json";

const colors = {
  retrofit: "#2ab7ca",
  unretrofit: "#fe4a49",
  retrofitNR: "#fed766",
};

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

    const retrofit = ["==", ["get", "retrofit_status"], "retrofit"];
    const unretrofit = ["==", ["get", "retrofit_status"], "not retrofit"];
    const retrofitNR = [
      "==",
      ["get", "retrofit_status"],
      "retrofit not required",
    ];

    map.on("load", function () {
      map.resize;

      map.addSource("retrofitFootprints", {
        type: "geojson",
        data: retrofitFootprints,
      });

      map.addSource("allBuildings", {
        type: "geojson",
        data: allBuildings,
        cluster: true,
        clusterRadius: 50,
        clusterProperties: {
          retrofit: ["+", ["case", retrofit, 1, 0]],
          unretrofit: ["+", ["case", unretrofit, 1, 0]],
          retrofitNR: ["+", ["case", retrofitNR, 1, 0]],
        },
      });

      map.addLayer({
        id: "building-circle",
        type: "circle",
        source: "allBuildings",
        filter: ["!=", "cluster", true],
        paint: {
          "circle-color": [
            "case",
            retrofit,
            colors.retrofit,
            unretrofit,
            colors.unretrofit,
            retrofitNR,
            colors.retrofitNR,
            "#ffffff",
          ],
          "circle-opacity": 0.9,
          "circle-radius": 8,
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
