"use client";

import { useEffect, useMemo, useState } from "react";
import Step from "./Step";
import { fetchLiveBuses, fetchAllRoutes } from "@/lib/api";

type StepLabel =
  | "Taken Bus"
  | "At Bus Stand"
  | "Active on Road"
  | "Break"
  | "Arrived";

interface StepMeta {
  icon: string;
  summary: string;
}

export default function DashboardCard() {
  const [busLabel, setBusLabel] = useState("BUS —");
  const [routeLabel, setRouteLabel] = useState("Loading...");

  useEffect(() => {
    Promise.all([fetchLiveBuses(), fetchAllRoutes()])
      .then(([buses, routes]) => {
        const bus = buses.find((b) => b.route_id) ?? buses[0];
        if (bus) setBusLabel(`BUS #${bus.id}`);
        const route = bus?.route_id
          ? routes.find((r) => String(r.id) === bus.route_id)
          : routes[0];
        if (route) {
          const parts = route.name.split(" - ");
          setRouteLabel(parts.length > 1 ? `${parts[0]?.trim()} → ${parts[1]?.trim()}` : route.name);
        }
      })
      .catch(() => {
        setBusLabel("BUS #882");
        setRouteLabel("Colombo → Piliyandala");
      });
  }, []);

  const journeySteps: StepLabel[] = [
    "Taken Bus",
    "At Bus Stand",
    "Active on Road",
    "Break",
    "Arrived",
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(2);
  const [selectedStep, setSelectedStep] = useState<StepLabel | null>(null);

  const stepDetails = useMemo(
    (): Record<StepLabel, StepMeta> => ({
      "Taken Bus": {
        icon: "check_circle",
        summary: "Driver has started the assigned route.",
      },
      "At Bus Stand": {
        icon: "check_circle",
        summary: "Vehicle reached the pickup stand and waiting passengers.",
      },
      "Active on Road": {
        icon: "directions_bus",
        summary: "Session is in progress with live tracking enabled.",
      },
      Break: {
        icon: "local_cafe",
        summary: "Driver break has been marked for this session.",
      },
      Arrived: {
        icon: "flag",
        summary: "Bus reached destination and can be completed.",
      },
    }),
    [],
  );

  const modalData = selectedStep ? stepDetails[selectedStep] : null;
  const selectedStepIndex = selectedStep
    ? journeySteps.indexOf(selectedStep)
    : -1;
  const canMoveToNextStep =
    selectedStepIndex !== -1 && selectedStepIndex < journeySteps.length - 1;

  useEffect(() => {
    if (!selectedStep) return;

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedStep(null);
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [selectedStep]);

  const moveToNextState = () => {
    if (
      selectedStepIndex === -1 ||
      selectedStepIndex >= journeySteps.length - 1
    ) {
      return;
    }

    const nextIndex = selectedStepIndex + 1;
    setCurrentStepIndex(nextIndex);
    setSelectedStep(journeySteps[nextIndex]);
  };

  return (
    <div className="dashboard-card-stack">
      {/* MAIN CARD */}
      <div className="dashboard-card">
        <div className="dashboard-card-content">
          {/* BADGES */}
          <div className="dashboard-badges">
            <span className="dashboard-pill dashboard-pill--bus">{busLabel}</span>

            <span className="dashboard-pill dashboard-pill--active">
              <span className="dashboard-pill-dot"></span>
              System Active
            </span>
          </div>

          {/* TITLE */}
          <h3 className="dashboard-route">{routeLabel}</h3>

          <p className="dashboard-route-meta">
            Expected Arrival 14:30
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

          <Step
            done={0 < currentStepIndex}
            active={0 === currentStepIndex}
            icon="check_circle"
            label="Taken Bus"
            onClick={() => setSelectedStep("Taken Bus")}
          />
          <Step
            done={1 < currentStepIndex}
            active={1 === currentStepIndex}
            icon="check_circle"
            label="At Bus Stand"
            onClick={() => setSelectedStep("At Bus Stand")}
          />
          <Step
            done={2 < currentStepIndex}
            active={2 === currentStepIndex}
            icon="directions_bus"
            label="Active on Road"
            onClick={() => setSelectedStep("Active on Road")}
          />
          <Step
            done={3 < currentStepIndex}
            active={3 === currentStepIndex}
            icon="local_cafe"
            label="Break"
            onClick={() => setSelectedStep("Break")}
          />
          <Step
            done={4 < currentStepIndex}
            active={4 === currentStepIndex}
            icon="flag"
            label="Arrived"
            onClick={() => setSelectedStep("Arrived")}
          />
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

      {selectedStep && modalData && (
        <div
          className="dashboard-status-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedStep} status details`}
          onClick={() => setSelectedStep(null)}
        >
          <div
            className="dashboard-status-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="dashboard-status-modal-icon">
              <span className="material-symbols-outlined">
                {modalData.icon}
              </span>
            </div>

            <h5 className="dashboard-status-modal-title">{selectedStep}</h5>
            <p className="dashboard-status-modal-text">{modalData.summary}</p>

            <div className="dashboard-status-modal-actions">
              <button
                type="button"
                className="dashboard-action"
                onClick={moveToNextState}
                disabled={!canMoveToNextStep}
              >
                Move to Next State
              </button>

              <button
                type="button"
                className="dashboard-action--secondary"
                onClick={() => setSelectedStep(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
