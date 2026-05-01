import DashboardCard from "@/app/components/DashboardCard";
import Sidebar from "@/app/components/sidebar";

export default function DashboardPage() {
  return (
    <div className="dashboard-shell">
      <Sidebar activeTab="dashboard" />

      {/* MAIN */}
      <main className="dashboard-main">
        {/* TOPBAR (FIXED LIKE DESIGN) */}
        <header className="dashboard-topbar">
          <h1 className="dashboard-topbar-title">On Time Transit</h1>

          <span className="dashboard-status-pill">Active Status: Online</span>
        </header>

        {/* CONTENT */}
        <div className="dashboard-content">
          <div>
            <h2 className="dashboard-heading">Active Session</h2>
            <p className="dashboard-description">
              Real-time telemetry and status for current route.
            </p>
          </div>

          <DashboardCard />
        </div>
      </main>
    </div>
  );
}
