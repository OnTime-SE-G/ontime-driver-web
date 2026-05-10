"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/sidebar";
import TopBar from "@/app/components/TopBar";
import {
  fetchTodayTrips,
  fetchDrivers,
  fetchSchedules,
  fetchRoutes,
  startTrip,
  type Trip,
  type Driver,
  type Schedule,
  type Route,
} from "@/app/lib/driverApi";

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  WAITING_AT_DEPOT:    { label: "NOT STARTED",  cls: "sessions-chip--status" },
  EN_ROUTE:            { label: "ACTIVE",        cls: "sessions-chip--status sessions-chip--active" },
  ARRIVED_DESTINATION: { label: "COMPLETED",     cls: "sessions-chip--status sessions-chip--done" },
  INCIDENT_REPORTED:   { label: "INCIDENT",      cls: "sessions-chip--status sessions-chip--incident" },
};

export default function SessionsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingId, setStartingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const operatorId = (session as { operatorId?: string } & typeof session)?.operatorId;

  const load = useCallback(async () => {
    if (!operatorId) return;
    setLoading(true);
    setError("");
    try {
      const [allDrivers, allTrips, allSchedules, allRoutes] = await Promise.all([
        fetchDrivers(),
        fetchTodayTrips(),
        fetchSchedules(),
        fetchRoutes(),
      ]);

      const me = allDrivers.find(
        (d) => d.username === operatorId || d.license_number === operatorId
      ) ?? null;
      setDriver(me);
      setSchedules(allSchedules);
      setRoutes(allRoutes);

      if (me) {
        setTrips(allTrips.filter((t) => t.driver_id === me.id));
      } else {
        setTrips([]);
      }
    } catch {
      setError("Failed to load sessions. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [operatorId]);

  useEffect(() => { load(); }, [load]);

  const handleStart = async (tripId: string) => {
    setStartingId(tripId);
    try {
      await startTrip(tripId);
      await load();
      router.push("/dashboard");
    } catch {
      setError("Failed to start session. Try again.");
      setStartingId(null);
    }
  };

  const getSchedule = (scheduleId: number) =>
    schedules.find((s) => s.id === scheduleId);

  const getRoute = (routeId: number) =>
    routes.find((r) => r.id === routeId);

  const formatTime = (timeStr: string) => {
    const [h, m] = timeStr.split(":");
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <div className="sessions-shell">
      <Sidebar activeTab="sessions" />
      <div className="sessions-main">
        <TopBar />
        <main className="sessions-content">
          <section className="sessions-header">
            <div>
              <h2 className="sessions-heading">Today&apos;s Sessions</h2>
              <p className="sessions-date">
                {today} • {loading ? "…" : `${trips.length} Assigned`}
              </p>
            </div>
          </section>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">{error}</p>
          )}

          {loading ? (
            <p className="text-sm text-gray-400 mt-8 text-center">Loading sessions…</p>
          ) : trips.length === 0 ? (
            <p className="text-sm text-gray-400 mt-8 text-center">No trips assigned to you today.</p>
          ) : (
            <section className="sessions-grid">
              {trips.map((trip, i) => {
                const schedule = getSchedule(trip.schedule_id);
                const route = schedule ? getRoute(schedule.route_id) : null;
                const statusInfo = STATUS_LABEL[trip.status] ?? { label: trip.status, cls: "sessions-chip--status" };
                const isActive = trip.status === "EN_ROUTE";
                const isFirst = i === 0;

                return isFirst ? (
                  <article key={trip.id} className="sessions-card-lg">
                    <div className="sessions-card-lg-inner">
                      <div>
                        <div className="sessions-top-info">
                          <span className="sessions-chip sessions-chip--route">
                            {trip.bus_id ? `BUS #${trip.bus_id}` : "BUS TBD"}
                          </span>
                          {schedule && (
                            <span className="sessions-clock">
                              <span className="material-symbols-outlined sessions-filter-icon">schedule</span>
                              Starts at {formatTime(schedule.scheduled_time)}
                            </span>
                          )}
                          <span className={`sessions-chip ${statusInfo.cls}`}>{statusInfo.label}</span>
                        </div>
                        <h3 className="sessions-route-title">
                          {route?.name ?? `Schedule #${trip.schedule_id}`}
                        </h3>
                        <p className="sessions-route-desc">
                          {trip.delay_minutes > 0
                            ? `Delayed by ${trip.delay_minutes} min`
                            : trip.actual_start_time
                            ? `Started at ${new Date(trip.actual_start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                            : "Pending start"}
                        </p>
                      </div>
                      <div className="sessions-card-lg-side">
                        {isActive ? (
                          <button
                            className="sessions-start-button"
                            onClick={() => router.push("/dashboard")}
                          >
                            <span className="material-symbols-outlined">open_in_new</span>
                            View Active
                          </button>
                        ) : trip.status === "WAITING_AT_DEPOT" ? (
                          <button
                            className="sessions-start-button"
                            disabled={startingId === trip.id}
                            onClick={() => handleStart(trip.id)}
                          >
                            <span className="material-symbols-outlined">play_circle</span>
                            {startingId === trip.id ? "Starting…" : "Start Session"}
                          </button>
                        ) : (
                          <span className={`sessions-chip ${statusInfo.cls}`}>{statusInfo.label}</span>
                        )}
                        <p className="sessions-note">
                          {trip.status === "WAITING_AT_DEPOT" ? "Vehicle inspection required prior to start." : ""}
                        </p>
                      </div>
                    </div>
                  </article>
                ) : (
                  <article key={trip.id} className="sessions-card-md">
                    <div className="sessions-card-md-top">
                      <span className="sessions-chip sessions-chip--route">
                        {trip.bus_id ? `BUS #${trip.bus_id}` : "BUS TBD"}
                      </span>
                      <span className={`sessions-chip ${statusInfo.cls}`}>{statusInfo.label}</span>
                    </div>
                    <h3 className="sessions-card-md-title">
                      {route?.name ?? `Schedule #${trip.schedule_id}`}
                    </h3>
                    <p className="sessions-card-md-desc">
                      {trip.delay_minutes > 0 ? `Delayed ${trip.delay_minutes} min` : "On schedule"}
                    </p>
                    <div className="sessions-card-md-footer">
                      {schedule && (
                        <span className="sessions-card-md-time">
                          <span className="material-symbols-outlined dashboard-info-icon--sm">schedule</span>
                          {formatTime(schedule.scheduled_time)}
                        </span>
                      )}
                      {trip.status === "WAITING_AT_DEPOT" && (
                        <button
                          className="sessions-details-button"
                          disabled={startingId === trip.id}
                          onClick={() => handleStart(trip.id)}
                        >
                          {startingId === trip.id ? "Starting…" : "Start"}
                        </button>
                      )}
                      {isActive && (
                        <button
                          className="sessions-details-button"
                          onClick={() => router.push("/dashboard")}
                        >
                          View Active
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
