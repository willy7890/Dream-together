import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Users, Heart, Target, Image as ImageIcon, ShieldCheck, Trash2, Search, Save } from "lucide-react";
import { Card, StatCard, SectionHeader, Input, Button } from "../../components/ui";
import { useAuth } from "../../contexts/AuthContext";
import * as adminService from "../../services/adminService";
import type { AdminStats, AdminUser } from "../../services/adminService";

export default function AdminPage() {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ full_name: "", email: "" });
  const [error, setError] = useState<string | null>(null);
  const [denied, setDenied] = useState(false);

  const loadStats = () => adminService.getAdminStats().then(setStats).catch(() => setDenied(true));
  const loadUsers = (q?: string) => adminService.listUsers(q).then(setUsers).catch(() => setDenied(true));

  useEffect(() => {
    loadStats();
    loadUsers();
  }, []);

  const startEdit = (u: AdminUser) => {
    setEditingId(u.id);
    setEditForm({ full_name: u.full_name, email: u.email });
    setError(null);
  };

  const saveEdit = async (id: number) => {
    setError(null);
    try {
      await adminService.updateUser(id, editForm);
      setEditingId(null);
      loadUsers(search);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Imeshindwa");
    }
  };

  const toggleAdmin = async (u: AdminUser) => {
    setError(null);
    try {
      await adminService.updateUser(u.id, { is_admin: !u.is_admin });
      loadUsers(search);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Imeshindwa");
    }
  };

  const removeUser = async (u: AdminUser) => {
    if (!confirm(`Futa akaunti ya ${u.full_name}? Hatua hii haiwezi kurudishwa.`)) return;
    setError(null);
    try {
      await adminService.deleteUser(u.id);
      loadUsers(search);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Imeshindwa");
    }
  };

  if (denied) {
    return <div className="text-[14px] text-coral">Access denied — admin only.</div>;
  }

  return (
    <div className="space-y-6">
      <SectionHeader title={t("admin_.title")} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t("admin_.totalUsers")} value={String(stats?.total_users ?? "—")} icon={Users} accent="#E8A33D" />
        <StatCard label={t("admin_.totalCouples")} value={String(stats?.total_couples ?? "—")} icon={Heart} accent="#F2667A" />
        <StatCard label={t("admin_.totalGoals")} value={String(stats?.total_goals ?? "—")} icon={Target} accent="#6FCF9E" />
        <StatCard label={t("admin_.totalMemories")} value={String(stats?.total_memories ?? "—")} icon={ImageIcon} accent="#8B7FD6" />
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-ink font-display">Watumiaji</h2>
          <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 w-64">
            <Search size={14} className="text-muted" />
            <input
              placeholder="Tafuta jina au email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); loadUsers(e.target.value); }}
              className="bg-transparent outline-none text-[13px] text-ink flex-1"
            />
          </div>
        </div>

        {error && <div className="text-[13px] text-coral mb-3">{error}</div>}

        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2.5">
              {editingId === u.id ? (
                <>
                  <Input
                    className="flex-1"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  />
                  <Input
                    className="flex-1"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                  <button onClick={() => saveEdit(u.id)} className="text-mint"><Save size={16} /></button>
                  <button onClick={() => setEditingId(null)} className="text-muted text-[12px]">{t("cancel")}</button>
                </>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <button onClick={() => startEdit(u)} className="text-[13px] text-ink hover:text-gold truncate block text-left">
                      {u.full_name}
                    </button>
                    <div className="text-[11px] text-muted truncate">{u.email}</div>
                  </div>
                  {!u.is_verified && <span className="text-[10px] text-muted px-2 py-0.5 rounded-full bg-white/5">unverified</span>}
                  <button
                    onClick={() => toggleAdmin(u)}
                    disabled={u.id === currentUser?.id}
                    className={`text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1 disabled:opacity-40 ${
                      u.is_admin ? "bg-gold/15 text-gold" : "bg-white/5 text-muted hover:text-gold"
                    }`}
                  >
                    <ShieldCheck size={12} /> {u.is_admin ? "Admin" : "Fanya Admin"}
                  </button>
                  <button
                    onClick={() => removeUser(u)}
                    disabled={u.id === currentUser?.id}
                    className="text-muted hover:text-coral disabled:opacity-30"
                  >
                    <Trash2 size={15} />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}