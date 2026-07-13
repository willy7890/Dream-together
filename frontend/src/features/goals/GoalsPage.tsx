import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Trash2 } from "lucide-react";
import { Card, SectionHeader, ProgressBar, Button, Modal, Input, Select, Textarea } from "../../components/ui";
import * as goalsService from "../../services/goalsService";
import type { Goal } from "../../services/goalsService";
import * as familyService from "../../services/familyService";
import type { FamilyMember } from "../../services/familyService";
import * as couplesService from "../../services/couplesService";

const CATEGORIES = ["marriage", "house", "car", "business", "education", "investment", "travel", "family", "health", "other"];

export default function GoalsPage() {
  const { t } = useTranslation();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isFamily, setIsFamily] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "other", target_amount: 0, deadline: "", assigned_member_id: "" });
  const [loading, setLoading] = useState(true);

  const load = () => goalsService.listGoals().then(setGoals).finally(() => setLoading(false));

  useEffect(() => {
    load();
    couplesService.myCouple().then((c) => {
      if (c.workspace_type === "family") {
        setIsFamily(true);
        familyService.listFamilyMembers().then(setMembers);
      }
    });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await goalsService.createGoal({
      ...form,
      assigned_member_id: form.assigned_member_id ? Number(form.assigned_member_id) : undefined,
    });
    setOpen(false);
    setForm({ title: "", description: "", category: "other", target_amount: 0, deadline: "", assigned_member_id: "" });
    load();
  };

  const bumpProgress = async (g: Goal) => {
    const next = Math.min(g.target_amount, g.current_amount + g.target_amount * 0.1);
    await goalsService.updateGoal(g.id, { current_amount: next });
    load();
  };

  const remove = async (id: number) => {
    await goalsService.deleteGoal(id);
    load();
  };

  const memberName = (id: number | null) => members.find((m) => m.id === id)?.full_name;

  return (
    <div>
      <SectionHeader title={t("nav.goals")} action={
        <Button onClick={() => setOpen(true)}><span className="flex items-center gap-1.5"><Plus size={15} /> {t("addGoal")}</span></Button>
      } />

      {!loading && goals.length === 0 && <div className="text-[14px] text-muted">{t("noGoalsYet")}</div>}

      <div className="grid md:grid-cols-2 gap-4">
        {goals.map((g) => (
          <Card key={g.id} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-gold/15 text-gold capitalize">{g.category}</span>
                {isFamily && g.assigned_member_id && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-violet/15 text-violet">{memberName(g.assigned_member_id)}</span>
                )}
              </div>
              <button onClick={() => remove(g.id)} className="text-muted hover:text-coral"><Trash2 size={14} /></button>
            </div>
            <div className="font-medium text-ink mb-1">{g.title}</div>
            <div className="text-[12px] text-muted mb-3">{g.current_amount.toLocaleString()} / {g.target_amount.toLocaleString()}</div>
            <ProgressBar pct={g.progress_pct} color={g.progress_pct > 70 ? "#6FCF9E" : "#E8A33D"} />
            <div className="flex items-center justify-between mt-2">
              <div className="text-[12px] text-muted">{g.progress_pct}% {t("progress")}</div>
              {g.status !== "completed" && (
                <button onClick={() => bumpProgress(g)} className="text-[12px] text-gold">+10%</button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={t("addGoal")}>
        <form onSubmit={submit} className="space-y-3">
          <Input required placeholder={t("title")} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea placeholder={t("description")} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
          <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          {isFamily && members.length > 0 && (
            <Select value={form.assigned_member_id} onChange={(e) => setForm({ ...form, assigned_member_id: e.target.value })}>
              <option value="">{t("family_.wholeFamily")}</option>
              {members.map((m) => <option key={m.id} value={m.id}>{m.full_name}</option>)}
            </Select>
          )}
          <Input type="number" min={0} placeholder={t("targetAmount")} value={form.target_amount} onChange={(e) => setForm({ ...form, target_amount: Number(e.target.value) })} />
          <Input type="date" placeholder={t("deadline")} value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>{t("cancel")}</Button>
            <Button type="submit">{t("save")}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
