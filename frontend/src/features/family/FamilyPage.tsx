import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Trash2, Baby, User as UserIcon, Users2 } from "lucide-react";
import { Card, SectionHeader, Button, Modal, Input, Select } from "../../components/ui";
import * as familyService from "../../services/familyService";
import type { FamilyMember } from "../../services/familyService";

const RELATION_ICON = { child: Baby, parent: UserIcon, other: Users2 };

export default function FamilyPage() {
  const { t } = useTranslation();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ full_name: "", relation: "child", age: "" });

  const load = () => familyService.listFamilyMembers().then(setMembers);
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await familyService.addFamilyMember({
      full_name: form.full_name,
      relation: form.relation as FamilyMember["relation"],
      age: form.age ? Number(form.age) : null,
    });
    setOpen(false);
    setForm({ full_name: "", relation: "child", age: "" });
    load();
  };

  const remove = async (id: number) => {
    await familyService.deleteFamilyMember(id);
    load();
  };

  return (
    <div>
      <SectionHeader title={t("family_.title")} action={
        <Button onClick={() => setOpen(true)}><span className="flex items-center gap-1.5"><Plus size={15} /> {t("family_.addMember")}</span></Button>
      } />

      {members.length === 0 && <div className="text-[14px] text-muted">{t("family_.noMembersYet")}</div>}

      <div className="grid md:grid-cols-2 gap-4">
        {members.map((m) => {
          const Icon = RELATION_ICON[m.relation] || Users2;
          return (
            <Card key={m.id} className="p-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${m.avatar_color}22`, color: m.avatar_color }}>
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-ink">{m.full_name}</div>
                <div className="text-[12px] text-muted capitalize">
                  {t(`family_.${m.relation}`)}{m.age ? ` · ${m.age} yrs` : ""}
                </div>
              </div>
              <button onClick={() => remove(m.id)} className="text-muted hover:text-coral">
                <Trash2 size={15} />
              </button>
            </Card>
          );
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={t("family_.addMember")}>
        <form onSubmit={submit} className="space-y-3">
          <Input required placeholder={t("family_.name")} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          <Select value={form.relation} onChange={(e) => setForm({ ...form, relation: e.target.value })}>
            <option value="child">{t("family_.child")}</option>
            <option value="parent">{t("family_.parent")}</option>
            <option value="other">{t("family_.other")}</option>
          </Select>
          <Input type="number" min={0} placeholder={t("family_.age")} value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>{t("cancel")}</Button>
            <Button type="submit">{t("save")}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
