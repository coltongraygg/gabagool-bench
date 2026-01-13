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
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-surface px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display text-xl font-bold tracking-wider">
              <span className="text-crimson group-hover:text-crimson-hover transition-colors">
                GABAGOOL
              </span>
              <span className="text-foreground group-hover:text-white transition-colors">
                {" "}BENCH
              </span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-display tracking-wider transition-colors ${
                isActive("/") && !isActive("/scenarios")
                  ? "bg-crimson/20 text-crimson border border-crimson/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              RESULTS
            </Link>
            <Link
              href="/scenarios"
              className={`px-4 py-2 rounded-lg text-sm font-display tracking-wider transition-colors ${
                isActive("/scenarios")
                  ? "bg-crimson/20 text-crimson border border-crimson/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
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
