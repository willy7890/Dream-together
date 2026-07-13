import React from "react";
import { Outlet } from "react-router-dom";
import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

/** Facebook-style language links, always visible in the top-right corner of the auth screens. */
function LanguagePicker() {
  const { i18n } = useTranslation();

  const setLang = (lang: "sw" | "en") => {
    i18n.changeLanguage(lang);
    localStorage.setItem("dt_lang", lang);
    document.documentElement.lang = lang;
  };

  return (
    <div className="absolute top-5 right-5 flex items-center gap-1 text-[12px]">
      <button
        onClick={() => setLang("sw")}
        className={i18n.language === "sw" ? "text-ink font-medium" : "text-muted hover:text-ink"}
      >
        Kiswahili
      </button>
      <span className="text-muted">·</span>
      <button
        onClick={() => setLang("en")}
        className={i18n.language === "en" ? "text-ink font-medium" : "text-muted hover:text-ink"}
      >
        English
      </button>
    </div>
  );
}

export default function AuthLayout() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen w-full bg-bg text-ink flex items-center justify-center font-body p-4 relative">
      <LanguagePicker />
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-coral flex items-center justify-center">
            <Heart size={19} className="text-bg" fill="#1B1533" />
          </div>
          <div className="text-center">
            <div className="font-display font-semibold text-lg leading-tight">{t("appName")}</div>
            <div className="text-[11px] text-muted leading-tight">{t("tagline")}</div>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
