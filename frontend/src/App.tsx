import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import WorkspaceGate from "./routes/WorkspaceGate";
import LoginPage from "./features/authentication/LoginPage";
import RegisterPage from "./features/authentication/RegisterPage";
import DashboardPage from "./features/dashboard/DashboardPage";
import GoalsPage from "./features/goals/GoalsPage";
import SavingsPage from "./features/savings/SavingsPage";
import MemoriesPage from "./features/memories/MemoriesPage";
import JournalPage from "./features/journal/JournalPage";
import TimelinePage from "./features/timeline/TimelinePage";
import MoodPage from "./features/settings/MoodPage";
import SettingsPage from "./features/settings/SettingsPage";
import VerifyEmailPage from "./features/authentication/VerifyEmailPage";
import FamilyPage from "./features/family/FamilyPage";
import AdminPage from "./features/admin/AdminPage";

export default function App() {
  return (
    <Routes>
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<WorkspaceGate />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/savings" element={<SavingsPage />} />
            <Route path="/memories" element={<MemoriesPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/mood" element={<MoodPage />} />
            <Route path="/family" element={<FamilyPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
