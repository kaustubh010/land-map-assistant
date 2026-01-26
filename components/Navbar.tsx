"use client";
import { BarChart3, Map, MapPin } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <header className="bg-card border-b border-border px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link href="/">
          <div className="flex items-center gap-3">
            <div className="text-5xl">🗺️</div>
            <div>
              <h1 className="text-base sm:text-xl font-semibold text-foreground">
                Land Record Digitization Assistant
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Village Parcel Verification System
              </p>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            onClick={() =>
              pathname === "/dashboard"
                ? router.push("/")
                : router.push("/dashboard")
            }
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm"
          >
            {pathname === "/dashboard" ? (
              <>
                <Map className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Show Map</span>
                <span className="sm:hidden">Map</span>
              </>
            ) : (
              <>
                <BarChart3 className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">View Report</span>
                <span className="sm:hidden">Report</span>
              </>
            )}
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
