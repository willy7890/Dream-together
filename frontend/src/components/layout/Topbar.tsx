import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bell } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import * as notificationsService from "../../services/notificationsService";
import type { AppNotification } from "../../services/notificationsService";

export default function Topbar({ titleKey }: { titleKey: string }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const load = () => notificationsService.listNotifications().then(setNotifications).catch(() => {});

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000); // poll every 30s for new automatic notifications
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = async (id: number) => {
    await notificationsService.markRead(id);
    load();
  };

  return (
    <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-white/5">
      <div>
        <div className="text-[13px] text-muted">{user?.full_name}</div>
        <h1 className="text-xl font-display font-semibold text-ink">{t(`nav.${titleKey}`)}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setOpen((o) => !o)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center relative text-ink">
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-coral text-[9px] flex items-center justify-center text-white font-medium">
                {unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl bg-surface border border-white/10 shadow-xl z-50">
              <div className="p-3 border-b border-white/5 text-[13px] font-medium text-ink">Notifications</div>
              {notifications.length === 0 ? (
                <div className="p-4 text-[13px] text-muted text-center">Hakuna arifa bado.</div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleMarkRead(n.id)}
                    className={`w-full text-left p-3 border-b border-white/5 last:border-0 hover:bg-white/5 ${!n.read ? "bg-gold/5" : ""}`}
                  >
                    <div className="flex items-start gap-2">
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />}
                      <div>
                        <div className="text-[13px] text-ink">{n.title}</div>
                        {n.body && <div className="text-[12px] text-muted mt-0.5">{n.body}</div>}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-bg" style={{ background: user?.avatar_color || "#E8A33D" }}>
          {user?.full_name?.[0] ?? "?"}
        </div>
      </div>
    </div>
  );
}
