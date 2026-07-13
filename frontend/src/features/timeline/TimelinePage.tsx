import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Card, SectionHeader, Button, Modal, Input, Textarea } from "../../components/ui";
import * as timelineService from "../../services/timelineService";
import type { TimelineEvent } from "../../services/timelineService";

export default function TimelinePage() {
  const { t } = useTranslation();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ label: "", description: "", date: new Date().toISOString().slice(0, 10) });

  const load = () => timelineService.listEvents().then(setEvents);
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await timelineService.createEvent(form);
    setOpen(false);
    setForm({ label: "", description: "", date: new Date().toISOString().slice(0, 10) });
    load();
  };

  return (
    <div>
      <SectionHeader title={t("nav.timeline")} action={
        <Button onClick={() => setOpen(true)}><span className="flex items-center gap-1.5"><Plus size={15} /> {t("addMilestone")}</span></Button>
      } />
      <Card className="p-6">
        {events.length === 0 ? (
          <div className="text-[14px] text-muted">{t("noEventsYet")}</div>
        ) : (
          <div className="relative pl-6 border-l-2 border-white/10 space-y-8">
            {events.map((m) => (
              <div key={m.id} className="relative">
                <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-gold ring-4 ring-bg" />
                <div className="text-[12px] text-muted">{m.date}</div>
                <div className="font-medium text-ink">{m.label}</div>
                {m.description && <div className="text-[13px] text-muted mt-0.5">{m.description}</div>}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={t("addMilestone")}>
        <form onSubmit={submit} className="space-y-3">
          <Input required placeholder={t("title")} value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
          <Textarea placeholder={t("description")} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
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
