"use client";

import { useEffect, useState } from "react";

export default function TopBar() {
  const [driverName, setDriverName] = useState("");

  useEffect(() => {
    setDriverName(localStorage.getItem("driver_name") ?? "");
  }, []);

  return (
    <div className="dashboard-topbar">
      <h1 className="dashboard-topbar-title">On Time</h1>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {driverName && (
          <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
            👤 {driverName}
          </span>
        )}
        <span className="dashboard-status-pill">Active Status: Online</span>
      </div>
    </div>
  );
}
