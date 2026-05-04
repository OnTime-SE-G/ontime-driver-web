"use client";

import Sidebar from "@/app/components/sidebar";
import TopBar from "@/app/components/TopBar";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { fetchAllTransitData, type ApiTransitRoute } from "@/lib/api";

mapboxgl.accessToken =
  "pk.eyJ1Ijoia2FsYW5hbGl5YW5hZ2UiLCJhIjoiY21vaDNyeGE3MDI0aDJwc2FmcWE5eG9meCJ9.36vlcSsm6E91cvh8F9f8XA";

export default function MapPage() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapLoaded = useRef(false);
  const [routes, setRoutes] = useState<Record<string, ApiTransitRoute>>({});

  useEffect(() => {
    fetchAllTransitData()
      .then(setRoutes)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [79.8612, 6.9271],
      zoom: 12,
    });

    mapRef.current.on("load", () => {
      mapLoaded.current = true;
    });
  }, []);

  useEffect(() => {
    const m = mapRef.current;
    if (!m || !mapLoaded.current || Object.keys(routes).length === 0) return;

    Object.values(routes).forEach((route) => {
      const srcId = `route-${route.id}`;
      if (m.getSource(srcId)) return;

      const coords = route.path.map(([lng, lat]) => [lng, lat]);
      m.addSource(srcId, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: coords },
        },
      });

      m.addLayer({
        id: srcId,
        type: "line",
        source: srcId,
        paint: {
          "line-color": route.color || "#2563EB",
          "line-width": 4,
          "line-opacity": 0.8,
        },
      });

      route.stops.forEach((stop) => {
        new mapboxgl.Marker({ color: "#2563EB" })
          .setLngLat(stop.coordinates)
          .setPopup(new mapboxgl.Popup().setText(stop.name))
          .addTo(m);
      });
    });
  }, [routes]);

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
