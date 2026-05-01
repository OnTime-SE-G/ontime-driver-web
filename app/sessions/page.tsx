"use client";

import Sidebar from "@/app/components/sidebar";
import TopBar from "@/app/components/TopBar";

export default function SessionsPage() {
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
                Thursday, October 26 • 3 Assigned Routes
              </p>
            </div>

            <span className="sessions-filter">
              <span className="material-symbols-outlined sessions-filter-icon">
                filter_list
              </span>
              Filter
            </span>
          </section>

          <section className="sessions-grid">
            <article className="sessions-card-lg">
              <div className="sessions-card-lg-inner">
                <div>
                  <div className="sessions-top-info">
                    <span className="sessions-chip sessions-chip--route">
                      BUS #882
                    </span>

                    <span className="sessions-clock">
                      <span className="material-symbols-outlined sessions-filter-icon">
                        schedule
                      </span>
                      Starts at 08:30 AM
                    </span>

                    <span className="sessions-chip sessions-chip--status">
                      NOT STARTED
                    </span>
                  </div>

                  <h3 className="sessions-route-title">
                    Colombo <span className="sessions-route-arrow">→</span>{" "}
                    Piliyandala
                  </h3>

                  <p className="sessions-route-desc">
                    Route 120 Express. Expected duration is 45 minutes with
                    normal traffic conditions.
                  </p>
                </div>

                <div className="sessions-card-lg-side">
                  <button className="sessions-start-button">
                    <span className="material-symbols-outlined">
                      play_circle
                    </span>
                    Start Session
                  </button>

                  <p className="sessions-note">
                    Vehicle inspection required prior to start.
                  </p>
                </div>
              </div>
            </article>

            <article className="sessions-card-md">
              <div className="sessions-card-md-top">
                <span className="sessions-chip sessions-chip--route">
                  BUS #882
                </span>

                <span className="sessions-chip sessions-chip--status">
                  NOT STARTED
                </span>
              </div>

              <h3 className="sessions-card-md-title">
                Piliyandala <span className="sessions-route-arrow">→</span>{" "}
                Colombo
              </h3>

              <p className="sessions-card-md-desc">
                Route 120 Return. Afternoon shift.
              </p>

              <div className="sessions-card-md-footer">
                <span className="sessions-card-md-time">
                  <span className="material-symbols-outlined dashboard-info-icon--sm">
                    schedule
                  </span>
                  14:00 PM
                </span>

                <button className="sessions-details-button">
                  View Details
                </button>
              </div>
            </article>

            <article className="sessions-card-md">
              <div className="sessions-card-md-top">
                <span className="sessions-chip sessions-chip--route">
                  BUS #405
                </span>

                <span className="sessions-chip sessions-chip--status">
                  NOT STARTED
                </span>
              </div>

              <h3 className="sessions-card-md-title">
                Colombo <span className="sessions-route-arrow">→</span>{" "}
                Maharagama
              </h3>

              <p className="sessions-card-md-desc">
                Route 138 Evening rush hour coverage.
              </p>

              <div className="sessions-card-md-footer">
                <span className="sessions-card-md-time">
                  <span className="material-symbols-outlined dashboard-info-icon--sm">
                    schedule
                  </span>
                  17:30 PM
                </span>

                <button className="sessions-details-button">
                  View Details
                </button>
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
