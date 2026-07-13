import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Users, Heart, Target, Image as ImageIcon } from "lucide-react";
import { StatCard, SectionHeader } from "../../components/ui";
import * as adminService from "../../services/adminService";
import type { AdminStats } from "../../services/adminService";

export default function AdminPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    adminService.getAdminStats().then(setStats).catch(() => setError(true));
  }, []);

  if (error) {
    return <div className="text-[14px] text-coral">Access denied — admin only.</div>;
  }

  return (
    <div>
      <SectionHeader title={t("admin_.title")} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t("admin_.totalUsers")} value={String(stats?.total_users ?? "—")} icon={Users} accent="#E8A33D" />
        <StatCard label={t("admin_.totalCouples")} value={String(stats?.total_couples ?? "—")} icon={Heart} accent="#F2667A" />
        <StatCard label={t("admin_.totalGoals")} value={String(stats?.total_goals ?? "—")} icon={Target} accent="#6FCF9E" />
        <StatCard label={t("admin_.totalMemories")} value={String(stats?.total_memories ?? "—")} icon={ImageIcon} accent="#8B7FD6" />
      </div>
    </div>
  );
}
