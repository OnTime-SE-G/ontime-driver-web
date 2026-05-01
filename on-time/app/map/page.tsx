"use client";

import Sidebar from "@/app/components/sidebar";
import TopBar from "@/app/components/TopBar";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";

mapboxgl.accessToken =
  "pk.eyJ1Ijoia2FsYW5hbGl5YW5hZ2UiLCJhIjoiY21vaDNyeGE3MDI0aDJwc2FmcWE5eG9meCJ9.36vlcSsm6E91cvh8F9f8XA";

export default function MapPage() {
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [79.8612, 6.9271],
      zoom: 12,
    });
  }, []);

  return (
    <div className="sessions-shell">
      <Sidebar activeTab="map" />

      <div className="sessions-main">
        <TopBar />
        <div id="map" className="map-stage" />
      </div>
    </div>
  );
}
