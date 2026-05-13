"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "대시보드", href: "/" },
  { label: "활동 데이터", href: "/activities" },
  { label: "배출계수", href: "/emission-factors" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-200">
        <span className="text-lg font-semibold text-green-700">PCF Dashboard</span>
      </div>
      <nav className="flex flex-col gap-1 px-3 py-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname === item.href
                ? "bg-green-50 text-green-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
