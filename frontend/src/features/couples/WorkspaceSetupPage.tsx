import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Heart, Users, Baby } from "lucide-react";
import * as couplesService from "../../services/couplesService";

interface Props {
  onDone: () => void;
}

/** Forced onboarding screen — shown once, right after first login, until a workspace type is chosen. */
export default function WorkspaceSetupPage({ onDone }: Props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<string | null>(null);

  const choose = async (type: "solo" | "couple" | "family") => {
    setLoading(type);
    try {
      await couplesService.setWorkspaceType(type);
      onDone();
    } finally {
      setLoading(null);
    }
  };

  const options = [
    { key: "solo" as const, icon: Heart, title: t("workspace.solo"), desc: t("workspace.soloDesc") },
    { key: "couple" as const, icon: Users, title: t("workspace.couple"), desc: t("workspace.coupleDesc") },
    { key: "family" as const, icon: Baby, title: t("workspace.family"), desc: t("workspace.familyDesc") },
  ];

  return (
    <div className="min-h-screen w-full bg-bg text-ink flex items-center justify-center font-body p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-semibold mb-2">{t("workspace.title")}</h1>
          <p className="text-[14px] text-muted">{t("workspace.subtitle")}</p>
        </div>

        <div className="space-y-3">
          {options.map(({ key, icon: Icon, title, desc }) => (
            <button
              key={key}
              onClick={() => choose(key)}
              disabled={loading !== null}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-surface border border-white/5 hover:border-gold/40 hover:bg-surface2 transition-colors text-left disabled:opacity-50"
            >
              <div className="w-11 h-11 rounded-xl bg-gold/15 text-gold flex items-center justify-center shrink-0">
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-ink">{title}</div>
                <div className="text-[13px] text-muted mt-0.5">{desc}</div>
              </div>
              {loading === key && <div className="text-[12px] text-gold">...</div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
