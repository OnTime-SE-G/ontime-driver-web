"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarLinkProps {
  href: string;
  label: string;
}

export default function SidebarLink({ href, label }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? "bg-white text-blue-600 shadow-sm" // Matches your active Dashboard style
          : "text-gray-500 hover:bg-gray-200 hover:text-gray-900" // Inactive style
      }`}
    >
      {label}
    </Link>
  );
}