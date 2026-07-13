import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Target, Wallet, Image as ImageIcon, Sparkles } from "lucide-react";
import { Card, StatCard, SectionHeader } from "../../components/ui";
import * as analyticsService from "../../services/analyticsService";
import type { DashboardStats } from "../../services/analyticsService";
import * as couplesService from "../../services/couplesService";
import ConnectPartner from "../couples/ConnectPartner";

export default function DashboardPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [partnered, setPartnered] = useState<boolean | null>(null);

  useEffect(() => {
    analyticsService.getDashboard().then(setStats).catch(() => {});
    couplesService.myCouple().then((c) => setPartnered(c.partnered)).catch(() => setPartnered(false));
  }, []);

  return (
    <div className="space-y-6">
      {partnered === false && <ConnectPartner compact />}

      <Card className="p-6 relative overflow-hidden">
        <div className="text-[13px] text-muted mb-1">{t("daysTogether")}</div>
        <div className="text-5xl font-display font-semibold text-gold">—</div>
        <div className="text-[13px] text-muted mt-2 flex items-center gap-1">
          <Sparkles size={13} className="text-coral" /> Set your anniversary date in Settings
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label={t("activeGoals")} value={String(stats?.active_goals ?? 0)} icon={Target} accent="#E8A33D" />
        <StatCard label={t("totalSaved")} value={String(stats?.total_saved ?? 0)} icon={Wallet} accent="#6FCF9E" />
        <StatCard label={t("memoriesCount")} value={String(stats?.memories_count ?? 0)} icon={ImageIcon} accent="#F2667A" />
      </div>

      <Card className="p-5">
        <SectionHeader title={t("quickActions")} />
        <p className="text-[13px] text-muted">
          {t("nav.goals")}, {t("nav.savings")}, {t("nav.memories")} — {t("nav.mood")}.
        </p>
      </Card>
    </div>
  );
}
