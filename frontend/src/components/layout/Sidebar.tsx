import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Home, Target, Wallet, Image as ImageIcon, BookOpen, Clock,
  Smile, Settings as SettingsIcon, Heart, LogOut, Baby, ShieldCheck
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import * as couplesService from "../../services/couplesService";

const BASE_ITEMS = [
  { to: "/", key: "dashboard", icon: Home },
  { to: "/goals", key: "goals", icon: Target },
  { to: "/savings", key: "savings", icon: Wallet },
  { to: "/memories", key: "memories", icon: ImageIcon },
  { to: "/journal", key: "journal", icon: BookOpen },
  { to: "/timeline", key: "timeline", icon: Clock },
  { to: "/mood", key: "mood", icon: Smile },
];

export default function Sidebar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [workspaceType, setWorkspaceType] = useState<string | null>(null);

  useEffect(() => {
    couplesService.myCouple().then((c) => setWorkspaceType(c.workspace_type)).catch(() => {});
  }, []);

  const items = [...BASE_ITEMS];
  if (workspaceType === "family") {
    items.push({ to: "/family", key: "family", icon: Baby });
  }
  items.push({ to: "/settings", key: "settings", icon: SettingsIcon });

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col border-r border-white/5 bg-sidebar p-5">
      <div className="flex items-center gap-2 px-1 mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-coral flex items-center justify-center">
          <Heart size={17} className="text-bg" fill="#1B1533" />
        </div>
        <div>
          <div className="font-display font-semibold leading-tight text-ink">{t("appName")}</div>
          <div className="text-[11px] text-muted leading-tight">{t("tagline")}</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {items.map(({ to, key, icon: Icon }) => (
          <NavLink
            key={key}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] transition-colors ${
                isActive ? "bg-surface2 text-ink" : "text-muted hover:bg-white/5 hover:text-ink"
              }`
            }
          >
            <Icon size={17} />
            {t(`nav.${key}`)}
          </NavLink>
        ))}

        {user?.is_admin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] transition-colors mt-2 border-t border-white/5 pt-3 ${
                isActive ? "text-gold" : "text-muted hover:text-gold"
              }`
            }
          >
            <ShieldCheck size={17} />
            {t("nav.admin")}
          </NavLink>
        )}
      </nav>

      <div className="border-t border-white/5 pt-3 mt-3">
        <div className="px-3 text-[12px] text-muted mb-2 truncate">{user?.email}</div>
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] text-muted hover:bg-white/5 hover:text-coral">
          <LogOut size={17} /> {t("auth.logout")}
        </button>
      </div>
    </aside>
  );
}
