"use client";

import { useEffect, useState, useCallback } from "react";
import Sidebar from "@/app/components/sidebar";
import TopBar from "@/app/components/TopBar";
import {
  fetchAllRoutes,
  fetchLiveBuses,
  fetchDriverTripsToday,
  startTrip,
  endTrip,
  type ApiRoute,
  type ApiLiveBus,
  type ApiPlannedTrip,
} from "@/lib/api";

export default function SessionsPage() {
  const [routes, setRoutes] = useState<ApiRoute[]>([]);
  const [buses, setBuses] = useState<ApiLiveBus[]>([]);
  const [trips, setTrips] = useState<ApiPlannedTrip[]>([]);
  const [loadingTripId, setLoadingTripId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    const driverId = localStorage.getItem("driver_id");
    const id = driverId ? Number(driverId) : undefined;
    fetchAllRoutes().then(setRoutes).catch(() => {});
    fetchLiveBuses().then(setBuses).catch(() => {});
    fetchDriverTripsToday(id).then(setTrips).catch(() => {});
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleStart = async (tripId: string) => {
    setLoadingTripId(tripId);
    setError(null);
    try {
      await startTrip(tripId);
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start session");
    } finally {
      setLoadingTripId(null);
    }
  };

  const handleEnd = async (tripId: string) => {
    setLoadingTripId(tripId);
    setError(null);
    try {
      await endTrip(tripId);
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to end session");
    } finally {
      setLoadingTripId(null);
    }
  };

  // Match trips to routes for display
  const tripCards = trips.map((trip) => {
    const route = routes.find((r) => r.id === trip.schedule_id) ?? routes[0];
    const bus = buses.find((b) => String(b.id) === String(trip.bus_id));
    return { trip, route, bus };
  });

  // Fall back to showing all routes if no trips exist
  const assignedBus = buses.find((b) => b.route_id) ?? buses[0];
  const primaryRoute = routes.find((r) => String(r.id) === assignedBus?.route_id) ?? routes[0];

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
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}{" "}
                • {trips.length > 0 ? trips.length : routes.length} Available Routes
              </p>
            </div>

            <span className="sessions-filter">
              <span className="material-symbols-outlined sessions-filter-icon">
                filter_list
              </span>
              Filter
            </span>
          </section>

          {error && (
            <div className="sessions-error">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}

          <section className="sessions-grid">
            {/* Trip-based cards (from backend) */}
            {tripCards.length > 0 ? (
              tripCards.map(({ trip, route, bus }, idx) => {
                const parts = route?.name.split(" - ") ?? ["—", ""];
                const origin = parts[0]?.trim() ?? "—";
                const destination = parts[1]?.trim() ?? "";
                const isLoading = loadingTripId === trip.id;
                const isActive = trip.status === "EN_ROUTE";
                const isDone = trip.status === "ARRIVED_DESTINATION" || trip.status === "completed";

                if (idx === 0) {
                  return (
                    <article key={trip.id} className="sessions-card-lg">
                      <div className="sessions-card-lg-inner">
                        <div>
                          <div className="sessions-top-info">
                            <span className="sessions-chip sessions-chip--route">
                              {bus ? `BUS #${bus.fleet_code}` : "BUS —"}
                            </span>
                            <span className="sessions-clock">
                              <span className="material-symbols-outlined sessions-filter-icon">
                                schedule
                              </span>
                              {trip.actual_start_time
                                ? `Started ${new Date(trip.actual_start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                                : "Starts at 08:30 AM"}
                            </span>
                            <span className={`sessions-chip sessions-chip--status${isActive ? " sessions-chip--active" : ""}`}>
                              {isDone ? "COMPLETED" : isActive ? "IN PROGRESS" : "NOT STARTED"}
                            </span>
                          </div>

                          <h3 className="sessions-route-title">
                            {origin} <span className="sessions-route-arrow">→</span>{" "}
                            {destination}
                          </h3>

                          <p className="sessions-route-desc">
                            Route {route?.route_number ?? route?.id ?? trip.schedule_id}. Expected duration is 45 minutes with normal traffic conditions.
                          </p>
                        </div>

                        <div className="sessions-card-lg-side">
                          {!isDone && (
                            <button
                              className="sessions-start-button"
                              disabled={isLoading}
                              onClick={() => isActive ? handleEnd(trip.id) : handleStart(trip.id)}
                            >
                              <span className="material-symbols-outlined">
                                {isLoading ? "hourglass_empty" : isActive ? "stop_circle" : "play_circle"}
                              </span>
                              {isLoading ? "Please wait…" : isActive ? "End Session" : "Start Session"}
                            </button>
                          )}
                          {isDone && (
                            <p className="sessions-note" style={{ color: "green" }}>Session completed.</p>
                          )}
                          <p className="sessions-note">
                            Vehicle inspection required prior to start.
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                }

                return (
                  <article key={trip.id} className="sessions-card-md">
                    <div className="sessions-card-md-top">
                      <span className="sessions-chip sessions-chip--route">
                        Route {route?.route_number ?? route?.id ?? trip.schedule_id}
                      </span>
                      <span className={`sessions-chip sessions-chip--status${isActive ? " sessions-chip--active" : ""}`}>
                        {isDone ? "COMPLETED" : isActive ? "IN PROGRESS" : "NOT STARTED"}
                      </span>
                    </div>
                    <h3 className="sessions-card-md-title">
                      {origin} <span className="sessions-route-arrow">→</span> {destination}
                    </h3>
                    <p className="sessions-card-md-desc">{route?.name ?? "—"}</p>
                    <div className="sessions-card-md-footer">
                      <span className="sessions-card-md-time">
                        <span className="material-symbols-outlined dashboard-info-icon--sm">schedule</span>
                        {trip.actual_start_time
                          ? new Date(trip.actual_start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : "--:--"}
                      </span>
                      {!isDone && (
                        <button
                          className="sessions-details-button"
                          disabled={isLoading}
                          onClick={() => isActive ? handleEnd(trip.id) : handleStart(trip.id)}
                        >
                          {isLoading ? "…" : isActive ? "End" : "Start"}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })
            ) : (
              /* Fallback: no trips from backend yet — show route list */
              primaryRoute ? (
                <article className="sessions-card-lg">
                  <div className="sessions-card-lg-inner">
                    <div>
                      <div className="sessions-top-info">
                        <span className="sessions-chip sessions-chip--route">
                          {assignedBus ? `BUS #${assignedBus.fleet_code}` : "BUS —"}
                        </span>
                        <span className="sessions-clock">
                          <span className="material-symbols-outlined sessions-filter-icon">schedule</span>
                          Starts at 08:30 AM
                        </span>
                        <span className="sessions-chip sessions-chip--status">NOT STARTED</span>
                      </div>
                      <h3 className="sessions-route-title">
                        {primaryRoute.name.split(" - ")[0]?.trim()} <span className="sessions-route-arrow">→</span>{" "}
                        {primaryRoute.name.split(" - ")[1]?.trim() ?? ""}
                      </h3>
                      <p className="sessions-route-desc">
                        Route {primaryRoute.route_number ?? primaryRoute.id}. No trip assigned yet.
                      </p>
                    </div>
                    <div className="sessions-card-lg-side">
                      <p className="sessions-note">No trip scheduled. Contact admin.</p>
                    </div>
                  </div>
                </article>
              ) : (
                <article className="sessions-card-lg">
                  <div className="sessions-card-lg-inner">
                    <p className="sessions-route-desc">No sessions assigned yet.</p>
                  </div>
                </article>
              )
            )}

            {/* Extra route cards when no trips — fallback */}
            {tripCards.length === 0 && routes.slice(1, 3).map((route) => {
              const rParts = route.name.split(" - ");
              return (
                <article key={route.id} className="sessions-card-md">
                  <div className="sessions-card-md-top">
                    <span className="sessions-chip sessions-chip--route">
                      Route {route.route_number ?? route.id}
                    </span>
                    <span className="sessions-chip sessions-chip--status">NOT STARTED</span>
                  </div>
                  <h3 className="sessions-card-md-title">
                    {rParts[0]?.trim() ?? route.name}{" "}
                    <span className="sessions-route-arrow">→</span>{" "}
                    {rParts[1]?.trim() ?? ""}
                  </h3>
                  <p className="sessions-card-md-desc">{route.name}</p>
                  <div className="sessions-card-md-footer">
                    <span className="sessions-card-md-time">
                      <span className="material-symbols-outlined dashboard-info-icon--sm">schedule</span>
                      --:--
                    </span>
                    <button className="sessions-details-button">View Details</button>
                  </div>
                </article>
              );
            })}
          </section>
        </main>
      </div>
    </div>
  );
}
