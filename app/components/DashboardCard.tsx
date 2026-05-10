"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Step from "./Step";
import {
  fetchTodayTrips,
  fetchDrivers,
  fetchSchedules,
  fetchRoutes,
  endTrip,
  reportDelay,
  reportIncident,
  type Trip,
  type Schedule,
  type Route,
} from "@/app/lib/driverApi";

type StepLabel = "Taken Bus" | "At Bus Stand" | "Active on Road" | "Break" | "Arrived";
const STEPS: StepLabel[] = ["Taken Bus", "At Bus Stand", "Active on Road", "Break", "Arrived"];

const STEP_ICONS: Record<StepLabel, string> = {
  "Taken Bus":       "check_circle",
  "At Bus Stand":    "check_circle",
  "Active on Road":  "directions_bus",
  "Break":           "local_cafe",
  "Arrived":         "flag",
};

export default function DashboardCard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [stepIndex, setStepIndex] = useState(0);
  const [selectedStep, setSelectedStep] = useState<StepLabel | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [incidentMsg, setIncidentMsg] = useState("");

  const operatorId = session?.user?.operatorId;

  const load = useCallback(async () => {
    if (!operatorId) return;
    setLoading(true);
    try {
      const [allDrivers, allTrips, allSchedules, allRoutes] = await Promise.all([
        fetchDrivers(),
        fetchTodayTrips(),
        fetchSchedules(),
        fetchRoutes(),
      ]);
      const me = allDrivers.find((d) => d.username === operatorId || d.license_number === operatorId);
      if (!me) { setActiveTrip(null); return; }

      const trip = allTrips.find((t) => t.driver_id === me.id && t.status === "EN_ROUTE") ?? null;
      setActiveTrip(trip);

      if (trip) {
        const sched = allSchedules.find((s) => s.id === trip.schedule_id) ?? null;
        setSchedule(sched);
        if (sched) setRoute(allRoutes.find((r) => r.id === sched.route_id) ?? null);
      }
    } catch {
      setError("Failed to load trip data.");
    } finally {
      setLoading(false);
    }
  }, [operatorId]);

  useEffect(() => { load(); }, [load]);

  const handleEndTrip = async () => {
    if (!activeTrip) return;
    setActionLoading(true);
    try {
      await endTrip(activeTrip.id);
      router.push("/sessions");
    } catch {
      setError("Failed to end trip. Try again.");
    } finally {
      setActionLoading(false);
      setSelectedStep(null);
    }
  };

  const handleReportIncident = async () => {
    if (!activeTrip) return;
    setActionLoading(true);
    try {
      await reportIncident(activeTrip.id, "BREAKDOWN", incidentMsg || undefined);
      await load();
      setShowIncidentModal(false);
      setIncidentMsg("");
    } catch {
      setError("Failed to report incident.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReportDelay = async (minutes: number) => {
    if (!activeTrip) return;
    try {
      await reportDelay(activeTrip.id, minutes);
      await load();
    } catch {
      setError("Failed to report delay.");
    }
  };

  const moveToNextStep = () => {
    const next = stepIndex + 1;
    if (next >= STEPS.length) return;
    setStepIndex(next);
    setSelectedStep(STEPS[next]);
    if (STEPS[next] === "Arrived") handleEndTrip();
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (status === "loading" || loading) {
    return <div className="dashboard-card-stack"><p className="text-sm text-gray-400 text-center py-12">Loading trip data…</p></div>;
  }

  if (!activeTrip) {
    return (
      <div className="dashboard-card-stack">
        <div className="dashboard-card">
          <div className="dashboard-card-content">
            <p className="text-sm text-gray-500 text-center py-8">No active trip. Go to Sessions to start one.</p>
            <button className="sessions-start-button w-full mt-4" onClick={() => router.push("/sessions")}>
              <span className="material-symbols-outlined">calendar_today</span>
              View Sessions
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card-stack">
      {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 mb-2">{error}</p>}

      {/* MAIN CARD */}
      <div className="dashboard-card">
        <div className="dashboard-card-content">
          <div className="dashboard-badges">
            <span className="dashboard-pill dashboard-pill--bus">
              {activeTrip.bus_id ? `BUS #${activeTrip.bus_id}` : "BUS TBD"}
            </span>
            <span className="dashboard-pill dashboard-pill--active">
              <span className="dashboard-pill-dot"></span>
              Active
            </span>
          </div>

          <h3 className="dashboard-route">
            {route?.name ?? `Schedule #${activeTrip.schedule_id}`}
          </h3>

          <p className="dashboard-route-meta">
            {schedule ? `Scheduled ${schedule.scheduled_time.slice(0, 5)}` : ""}
            {activeTrip.actual_start_time ? ` • Started ${formatTime(activeTrip.actual_start_time)}` : ""}
            {activeTrip.delay_minutes > 0 ? ` • Delayed ${activeTrip.delay_minutes} min` : ""}
          </p>

          <div className="dashboard-info-grid">
            <div className="dashboard-info-card">
              <span className="material-symbols-outlined dashboard-info-icon">route</span>
              <div>
                <p className="dashboard-info-title">ROUTE</p>
                <p className="dashboard-info-value">{route?.name ?? "—"}</p>
              </div>
            </div>
            <div className="dashboard-info-card">
              <span className="material-symbols-outlined dashboard-info-icon">timer</span>
              <div>
                <p className="dashboard-info-title">DELAY</p>
                <p className={`dashboard-info-value ${activeTrip.delay_minutes > 0 ? "text-red-500" : "dashboard-info-value--success"}`}>
                  {activeTrip.delay_minutes > 0 ? `+${activeTrip.delay_minutes} min` : "On time"}
                </p>
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
          {STEPS.map((step, i) => (
            <Step
              key={step}
              done={i < stepIndex}
              active={i === stepIndex}
              icon={STEP_ICONS[step]}
              label={step}
              onClick={() => setSelectedStep(step)}
            />
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="dashboard-actions">
        <button className="dashboard-action" onClick={() => handleReportDelay(5)} disabled={actionLoading}>
          <span className="material-symbols-outlined">timer</span>
          Report +5 min Delay
        </button>
        <button className="dashboard-action--secondary" onClick={() => setShowIncidentModal(true)} disabled={actionLoading}>
          <span className="material-symbols-outlined dashboard-action-icon--error">emergency</span>
          Report Incident
        </button>
        <button className="dashboard-action" onClick={handleEndTrip} disabled={actionLoading}>
          <span className="material-symbols-outlined">flag</span>
          {actionLoading ? "Ending…" : "End Trip"}
        </button>
      </div>

      {/* STEP MODAL */}
      {selectedStep && (
        <div className="dashboard-status-modal-backdrop" role="dialog" aria-modal="true"
          onClick={() => setSelectedStep(null)}>
          <div className="dashboard-status-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dashboard-status-modal-icon">
              <span className="material-symbols-outlined">{STEP_ICONS[selectedStep]}</span>
            </div>
            <h5 className="dashboard-status-modal-title">{selectedStep}</h5>
            <div className="dashboard-status-modal-actions">
              {selectedStep !== "Arrived" && (
                <button type="button" className="dashboard-action" onClick={moveToNextStep} disabled={actionLoading}>
                  Move to Next State
                </button>
              )}
              {selectedStep === "Arrived" && (
                <button type="button" className="dashboard-action" onClick={handleEndTrip} disabled={actionLoading}>
                  {actionLoading ? "Ending…" : "Confirm Arrival & End Trip"}
                </button>
              )}
              <button type="button" className="dashboard-action--secondary" onClick={() => setSelectedStep(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INCIDENT MODAL */}
      {showIncidentModal && (
        <div className="dashboard-status-modal-backdrop" role="dialog" aria-modal="true"
          onClick={() => setShowIncidentModal(false)}>
          <div className="dashboard-status-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dashboard-status-modal-icon">
              <span className="material-symbols-outlined text-red-500">emergency</span>
            </div>
            <h5 className="dashboard-status-modal-title">Report Incident</h5>
            <textarea
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm mt-2"
              rows={3}
              placeholder="Describe the incident (optional)…"
              value={incidentMsg}
              onChange={(e) => setIncidentMsg(e.target.value)}
            />
            <div className="dashboard-status-modal-actions">
              <button type="button" className="dashboard-action--secondary" onClick={handleReportIncident} disabled={actionLoading}>
                {actionLoading ? "Reporting…" : "Submit Breakdown Report"}
              </button>
              <button type="button" className="dashboard-action" onClick={() => setShowIncidentModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
