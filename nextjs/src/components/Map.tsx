import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import { PMTiles, Protocol } from "pmtiles";
import "maplibre-gl/dist/maplibre-gl.css";
import styles from "@/styles/Home.module.css";
import { maptiler3dGl } from "@/styles/maptiler-3d-gl";
import retrofitFootprints from "../assets/la_buildings_retrofit_footprints.json";
import allRetrofits from "../assets/retrofit_addresses.json";
import missingRetrofits from "../assets/unretrofit_addresses.json";

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
      style: {
        version: 8,
        sources: {
          openmaptiles: {
            "type": "vector",
            "tiles": ["pmtiles://" + mapFile.source.getKey() + "/{z}/{x}/{y}"],
          }
        },
        layers: maptiler3dGl.layers,
        glyphs: process.env.NEXT_PUBLIC_URL + "/{fontstack}/{range}.pbf",
      },
    });
    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl({}), "bottom-left");

    map.on("load", function () {
      map.resize;

      map.addSource("allRetrofits", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: allRetrofits.features,
        },
        cluster: true,
        clusterMaxZoom: 16,
        clusterRadius: 50,
      });

      map.addLayer({
        id: "test",
        type: "circle",
        source: "allRetrofits",
        filter: ["has", "point_count"],
        minZoom: 5,
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            20,
            "#f1f075",
            50,
            "#f28cb1",
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            1,
            5,
            5,
            10,
            20,
            20,
            30,
            30,
            40,
          ],
        },
      });
    });

    return () => {
      map.remove()
    };
  }, []);

  return (
    <div ref={mapContainerRef} className={styles.mapContainer}>
      <div ref={mapContainerRef}></div>
    </div>
  );
}

export default Map;
