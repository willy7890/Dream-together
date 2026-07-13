import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MailWarning } from "lucide-react";
import { Card, SectionHeader, Input, Button } from "../../components/ui";
import { useAuth } from "../../contexts/AuthContext";
import * as authService from "../../services/authService";

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { user, refreshUser } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [saved, setSaved] = useState(false);
  const [resent, setResent] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">((localStorage.getItem("dt_theme") as "dark" | "light") || "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("light-theme", theme === "light");
    localStorage.setItem("dt_theme", theme);
  }, [theme]);

  const changeLanguage = async (lang: "sw" | "en") => {
    i18n.changeLanguage(lang);
    localStorage.setItem("dt_lang", lang);
    document.documentElement.lang = lang;
    try {
      await authService.updateMe({ language: lang });
      await refreshUser();
    } catch {
      /* offline/local-only change is still fine */
    }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await authService.updateMe({ full_name: fullName });
    await refreshUser();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const resendVerification = async () => {
    await authService.resendVerification();
    setResent(true);
  };

  return (
    <div className="max-w-lg space-y-4">
      {user && !user.is_verified && (
        <Card className="p-4 flex items-start gap-3 border-gold/30">
          <MailWarning size={18} className="text-gold shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-[13px] text-ink">Barua pepe yako haijathibitishwa bado.</div>
            <div className="text-[12px] text-muted mt-0.5">
              Angalia terminal ya backend (au inbox yako ukiwa production) kwa kiungo cha uthibitisho.
            </div>
            {resent ? (
              <div className="text-[12px] text-mint mt-2">✓ Kiungo kimetumwa tena.</div>
            ) : (
              <button onClick={resendVerification} className="text-[12px] text-gold mt-2">
                Tuma kiungo tena
              </button>
            )}
          </div>
        </Card>
      )}

      <Card className="p-5">
        <SectionHeader title={t("profile")} />
        <form onSubmit={saveProfile} className="space-y-3">
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t("auth.fullName")} />
          <Input value={user?.email || ""} disabled />
          <Button type="submit">{saved ? "✓" : t("save")}</Button>
        </form>
      </Card>

      <Card className="p-5">
        <SectionHeader title={t("language")} />
        <div className="flex gap-2">
          {(["sw", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => changeLanguage(l)}
              className={`px-4 py-2 rounded-xl text-[13px] ${i18n.language === l ? "bg-gold text-bg" : "bg-white/5 text-ink"}`}
            >
              {l === "sw" ? "Kiswahili" : "English"}
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <SectionHeader title={t("theme")} />
        <div className="flex gap-2">
          {(["dark", "light"] as const).map((th) => (
            <button
              key={th}
              onClick={() => setTheme(th)}
              className={`px-4 py-2 rounded-xl text-[13px] ${theme === th ? "bg-gold text-bg" : "bg-white/5 text-ink"}`}
            >
              {th === "dark" ? t("dark") : t("light")}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
