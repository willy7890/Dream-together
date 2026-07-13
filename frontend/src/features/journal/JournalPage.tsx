import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Card, SectionHeader, Button, Modal, Input, Textarea, Select } from "../../components/ui";
import * as journalService from "../../services/journalService";
import type { JournalEntry } from "../../services/journalService";

const MOODS = ["happy", "excited", "relaxed", "neutral", "sad", "angry", "stressed", "tired"];
const MOOD_EMOJI: Record<string, string> = { happy: "😊", excited: "🤩", relaxed: "😌", neutral: "😐", sad: "😔", angry: "😠", stressed: "😩", tired: "😴" };

export default function JournalPage() {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", mood: "happy", text: "", date: new Date().toISOString().slice(0, 10) });

  const load = () => journalService.listEntries().then(setEntries);
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await journalService.createEntry(form);
    setOpen(false);
    setForm({ title: "", mood: "happy", text: "", date: new Date().toISOString().slice(0, 10) });
    load();
  };

  return (
    <div>
      <SectionHeader title={t("nav.journal")} action={
        <Button onClick={() => setOpen(true)}><span className="flex items-center gap-1.5"><Plus size={15} /> {t("writeEntry")}</span></Button>
      } />
      {entries.length === 0 && <div className="text-[14px] text-muted">{t("noEntriesYet")}</div>}
      <div className="space-y-3">
        {entries.map((e) => (
          <Card key={e.id} className="p-4 flex items-start gap-4">
            <div className="text-2xl">{MOOD_EMOJI[e.mood || "neutral"]}</div>
            <div className="flex-1">
              <div className="text-[12px] text-muted mb-1">{e.date}</div>
              {e.title && <div className="font-medium text-ink mb-0.5">{e.title}</div>}
              <div className="text-[14px] text-ink/90">{e.text}</div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={t("writeEntry")}>
        <form onSubmit={submit} className="space-y-3">
          <Input placeholder={t("title")} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Select value={form.mood} onChange={(e) => setForm({ ...form, mood: e.target.value })}>
            {MOODS.map((m) => <option key={m} value={m}>{MOOD_EMOJI[m]} {m}</option>)}
          </Select>
          <Textarea required rows={4} placeholder={t("yourEntry")} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
          <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>{t("cancel")}</Button>
            <Button type="submit">{t("save")}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
