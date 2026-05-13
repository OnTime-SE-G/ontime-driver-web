"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, LayoutDashboard, LogOut, UserCog } from "lucide-react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const AVATAR_COLORS = [
  "#4F46E5", "#7C3AED", "#DB2777", "#DC2626",
  "#D97706", "#059669", "#0284C7", "#0891B2",
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

type ActiveTab = "dashboard" | "sessions" | "map";

interface SidebarProps {
  activeTab?: ActiveTab;
}

export default function Sidebar({ activeTab }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navClassName = (href: string, tab: ActiveTab) => {
    const isActive =
      activeTab === tab || pathname === href || pathname.startsWith(`${href}/`);
    return `dashboard-nav-item ${isActive ? "dashboard-nav-item--active" : ""}`;
  };

  return (
    <aside className="dashboard-sidebar">
      <div>
        <div className="mb-6">
          <h1 className="dashboard-sidebar-title">On Time</h1>
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mt-0.5">Public Transport</p>
        </div>

        <div className="dashboard-driver">
          <div
            className="dashboard-driver-photo"
            style={{
              backgroundColor: getAvatarColor(session?.user?.name ?? session?.user?.operatorId ?? "driver"),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.875rem",
              userSelect: "none",
              flexShrink: 0,
            }}
          >
            {getInitials(session?.user?.name ?? session?.user?.operatorId ?? "DV")}
          </div>
          <div>
            <p className="dashboard-driver-name">{session?.user?.name ?? "—"}</p>
            <p className="dashboard-driver-id">{session?.user?.operatorId ?? "—"}</p>
          </div>
        </div>

        <nav className="dashboard-nav" aria-label="Main navigation">
          <Link
            href="/dashboard"
            className={navClassName("/dashboard", "dashboard")}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            href="/sessions"
            className={navClassName("/sessions", "sessions")}
          >
            <Calendar size={18} />
            Sessions
          </Link>

          <Link href="/account" className={navClassName("/account", "dashboard")}>
            <UserCog size={18} />
            My Account
          </Link>

          <button onClick={() => signOut({ callbackUrl: "/" })} className="dashboard-nav-item dashboard-nav-spacer w-full text-left">
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </div>
    </aside>
  );
}
