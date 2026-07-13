import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

const ROUTE_KEY: Record<string, string> = {
  "/": "dashboard", "/goals": "goals", "/savings": "savings", "/memories": "memories",
  "/journal": "journal", "/timeline": "timeline", "/mood": "mood", "/settings": "settings",
};

export default function MainLayout() {
  const location = useLocation();
  const titleKey = ROUTE_KEY[location.pathname] ?? "dashboard";

  return (
    <div className="min-h-screen w-full bg-bg text-ink flex font-body">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <Topbar titleKey={titleKey} />
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
