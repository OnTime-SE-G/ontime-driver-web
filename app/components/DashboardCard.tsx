"use client";

import Step from "./Step";

export default function DashboardCard() {
  return (
    <div className="dashboard-card-stack">
      {/* MAIN CARD */}
      <div className="dashboard-card">
        <div className="dashboard-card-content">
          {/* BADGES */}
          <div className="dashboard-badges">
            <span className="dashboard-pill dashboard-pill--bus">BUS #882</span>

            <span className="dashboard-pill dashboard-pill--active">
              <span className="dashboard-pill-dot"></span>
              System Active
            </span>
          </div>

          {/* TITLE */}
          <h3 className="dashboard-route">
            Colombo <span className="dashboard-route-arrow">→</span> Piliyandala
          </h3>

          <p className="dashboard-route-meta">
            Route 120 Express • Expected Arrival 14:30
          </p>

          {/* INFO */}
          <div className="dashboard-info-grid">
            <div className="dashboard-info-card">
              <span className="material-symbols-outlined dashboard-info-icon">
                satellite_alt
              </span>
              <div>
                <p className="dashboard-info-title">GPS TELEMETRY</p>
                <p className="dashboard-info-value dashboard-info-value--success">
                  <span className="material-symbols-outlined dashboard-info-icon--sm">
                    check_circle
                  </span>
                  Locked (12 Sats)
                </p>
              </div>
            </div>

            <div className="dashboard-info-card">
              <span className="material-symbols-outlined dashboard-info-icon">
                speed
              </span>
              <div>
                <p className="dashboard-info-title">CURRENT SPEED</p>
                <p className="dashboard-info-value">42 km/h</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STEPPER */}
      <div className="dashboard-stepper">
        <h4 className="dashboard-stepper-title">Journey Status</h4>

        <div className="dashboard-stepper-track">
          <div className="dashboard-stepper-line"></div>
          <div className="dashboard-stepper-progress"></div>

          <Step done icon="check" label="Taken Bus" />
          <Step done icon="check" label="At Bus Stand" />
          <Step active icon="directions_bus" label="Active on Road" />
          <Step icon="local_cafe" label="Break" />
          <Step icon="flag" label="Arrived" />
        </div>
      </div>

      {/* BUTTONS */}
      <div className="dashboard-actions">
        <button className="dashboard-action">
          <span className="material-symbols-outlined">pause_circle</span>
          Initiate Break
        </button>

        <button className="dashboard-action--secondary">
          <span className="material-symbols-outlined dashboard-action-icon--error">
            emergency
          </span>
          Report Incident
        </button>
      </div>
    </div>
  );
}
