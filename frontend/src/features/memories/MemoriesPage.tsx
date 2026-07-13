import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Trash2, Upload, Loader2 } from "lucide-react";
import { Card, SectionHeader, Button, Modal, Input, Textarea } from "../../components/ui";
import * as memoriesService from "../../services/memoriesService";
import type { Memory } from "../../services/memoriesService";

const COLORS = ["#E8A33D", "#F2667A", "#6FCF9E", "#8B7FD6"];
const API_ORIGIN = (import.meta.env.VITE_API_URL || "/api/v1").replace(/\/api\/v1\/?$/, "");

function resolveUrl(url: string | null) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_ORIGIN}${url}`;
}

export default function MemoriesPage() {
  const { t } = useTranslation();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", date: new Date().toISOString().slice(0, 10), location: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = () => memoriesService.listMemories().then(setMemories);
  useEffect(() => { load(); }, []);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await memoriesService.uploadFile(file);
      setUploadedUrl(result.url);
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Upload imeshindwa");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await memoriesService.createMemory({ ...form, media_url: uploadedUrl || undefined });
    setOpen(false);
    setForm({ title: "", description: "", date: new Date().toISOString().slice(0, 10), location: "" });
    setUploadedUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    load();
  };

  const remove = async (id: number) => {
    await memoriesService.deleteMemory(id);
    load();
  };

  return (
    <div>
      <SectionHeader title={t("nav.memories")} action={
        <Button onClick={() => setOpen(true)}><span className="flex items-center gap-1.5"><Plus size={15} /> {t("addMemory")}</span></Button>
      } />
      {memories.length === 0 && <div className="text-[14px] text-muted">{t("noMemoriesYet")}</div>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {memories.map((m, i) => (
          <Card key={m.id} className="overflow-hidden group relative">
            {m.media_url ? (
              <img src={resolveUrl(m.media_url) || ""} className="aspect-square object-cover w-full" />
            ) : (
              <div className="aspect-square" style={{ background: `linear-gradient(160deg, ${COLORS[i % 4]}66, ${COLORS[i % 4]}15)` }} />
            )}
            <button onClick={() => remove(m.id)} className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Trash2 size={13} />
            </button>
            <div className="p-3">
              <div className="text-[13px] font-medium text-ink truncate">{m.title}</div>
              <div className="text-[11px] text-muted">{m.date}</div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={t("addMemory")}>
        <form onSubmit={submit} className="space-y-3">
          <Input required placeholder={t("title")} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea placeholder={t("description")} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />

          <div>
            <input ref={fileInputRef} type="file" accept="image/*,video/*,audio/*,.pdf" onChange={handleFile} className="hidden" id="memory-file" />
            <label
              htmlFor="memory-file"
              className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10 rounded-xl px-3 py-3 text-[13px] text-muted cursor-pointer"
            >
              {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
              {uploading ? "Inapakia..." : uploadedUrl ? "✓ Faili imepakiwa" : t("mediaUrl")}
            </label>
            {uploadedUrl && (
              <img src={resolveUrl(uploadedUrl) || ""} className="mt-2 rounded-xl h-24 w-full object-cover" />
            )}
          </div>

          <Input placeholder={t("location")} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>{t("cancel")}</Button>
            <Button type="submit" disabled={uploading}>{t("save")}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
