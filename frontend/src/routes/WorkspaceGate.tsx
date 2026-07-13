import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import * as couplesService from "../services/couplesService";
import WorkspaceSetupPage from "../features/couples/WorkspaceSetupPage";

/** Sits inside ProtectedRoute: forces the Solo/Couple/Family choice before any other page loads. */
export default function WorkspaceGate() {
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  const check = () => {
    couplesService
      .myCouple()
      .then((c) => setNeedsSetup(!c.workspace_type))
      .catch(() => setNeedsSetup(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    check();
  }, []);

  if (loading) return <div className="min-h-screen bg-bg flex items-center justify-center text-muted">Loading...</div>;
  if (needsSetup) return <WorkspaceSetupPage onDone={() => setNeedsSetup(false)} />;
  return <Outlet />;
}
