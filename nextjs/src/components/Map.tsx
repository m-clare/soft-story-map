import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import { PMTiles, Protocol } from "pmtiles";
import "maplibre-gl/dist/maplibre-gl.css";
import styles from "@/styles/Home.module.css";
import { maptiler3dGl } from "@/styles/maptiler-3d-gl";
import retrofitFootprints from "../assets/la_buildings_retrofit_footprints.json";
import allRetrofits from "../assets/retrofit_addresses.json";
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
      minZoom: 5,
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
          ...retrofitFootprints
        },
      });

      map.addSource("allRetrofits", {
        type: "geojson",
        data: {
          ...allRetrofits
        },
        cluster: true,
        clusterMaxZoom: 18,
        clusterRadius: 50,
      });

      map.addSource("missingRetrofits", {
        type: "geojson",
        data: {
          ...missingRetrofits
        },
      })

      map.addSource("verificationRetrofits", {
        type: "geojson",
        data: {
          ...verificationRetrofits
        }
      })

      map.addLayer({
        id: "matched-footprints",
        type: "fill",
        source: "retrofitFootprints",
        minzoom: 8,
        paint: {
          "fill-color": "#24939e",
          "fill-opacity": 0.8,
        },
      }, "building-3d");

      map.addLayer({
        id: "all-retrofits",
        type: "circle",
        source: "allRetrofits",
        filter: ["has", "point_count"],
        minzoom: 5,
        maxzoom: 18,
        paint: {
          "circle-color": "#2ab7ca",
          "circle-radius": [
            "step",
            ["get", "point_count"],
            1,
            5,
            10,
            10,
            20,
            20,
            30,
            30,
            40,
          ],
        },
      });

      map.addLayer({
        id: "missing-retrofits",
        type: "circle",
        source: "missingRetrofits",
        minzoom: 10,
        maxzoom: 18,
        paint: {
          "circle-color": "#fe4a49",
          "circle-radius": 5,
        },
      });

      map.addLayer({
        id: "verified-noretrofits",
        type: "circle",
        source: "verificationRetrofits",
        minzoom: 10,
        maxzoom: 18,
        paint: {
          "circle-color": "#fed766",
          "circle-radius": 5,
        },
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
