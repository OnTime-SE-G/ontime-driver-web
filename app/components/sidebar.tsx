"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, LayoutDashboard, LogOut, Map } from "lucide-react";

type ActiveTab = "dashboard" | "sessions" | "map";

interface SidebarProps {
  activeTab?: ActiveTab;
}

export default function Sidebar({ activeTab }: SidebarProps) {
  const pathname = usePathname();

  const navClassName = (href: string, tab: ActiveTab) => {
    const isActive =
      activeTab === tab || pathname === href || pathname.startsWith(`${href}/`);
    return `dashboard-nav-item ${isActive ? "dashboard-nav-item--active" : ""}`;
  };

  return (
    <aside className="dashboard-sidebar">
      <div>
        <h1 className="dashboard-sidebar-title">On Time</h1>

        <div className="dashboard-driver">
          <Image
            src="https://i.pravatar.cc/100"
            alt="Driver profile"
            width={48}
            height={48}
            unoptimized
            className="dashboard-driver-photo"
          />
          <div>
            <p className="dashboard-driver-name">Marcus Driver</p>
            <p className="dashboard-driver-id">ID: 4492-BT</p>
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

          <Link href="/map" className={navClassName("/map", "map")}>
            <Map size={18} />
            Map
          </Link>

          <Link href="/" className="dashboard-nav-item dashboard-nav-spacer">
            <LogOut size={18} />
            Logout
          </Link>
        </nav>
      </div>
    </aside>
  );
}
