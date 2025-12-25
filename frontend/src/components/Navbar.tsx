"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-[family-name:var(--font-display)] text-xl font-bold tracking-wider">
              <span className="text-[#DC143C] group-hover:text-[#FF4444] transition-colors">
                GABAGOOL
              </span>
              <span className="text-[#e8e8e8] group-hover:text-white transition-colors">
                {" "}BENCH
              </span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-[family-name:var(--font-display)] tracking-wider transition-all ${
                isActive("/") && !isActive("/scenarios")
                  ? "bg-[#DC143C]/20 text-[#DC143C] border border-[#DC143C]/30"
                  : "text-[#888] hover:text-[#e8e8e8] hover:bg-[#141414]"
              }`}
            >
              RESULTS
            </Link>
            <Link
              href="/scenarios"
              className={`px-4 py-2 rounded-lg text-sm font-[family-name:var(--font-display)] tracking-wider transition-all ${
                isActive("/scenarios")
                  ? "bg-[#DC143C]/20 text-[#DC143C] border border-[#DC143C]/30"
                  : "text-[#888] hover:text-[#e8e8e8] hover:bg-[#141414]"
              }`}
            >
              SCENARIOS
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
