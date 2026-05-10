"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, LayoutDashboard, LogOut, Map, UserCog } from "lucide-react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

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
          <Image
            src={`https://i.pravatar.cc/100?u=${session?.user?.operatorId ?? "driver"}`}
            alt="Driver profile"
            width={48}
            height={48}
            unoptimized
            className="dashboard-driver-photo"
          />
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

          <Link href="/map" className={navClassName("/map", "map")}>
            <Map size={18} />
            Map
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
