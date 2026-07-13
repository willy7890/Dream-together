import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, TrendingUp, Wallet } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, SectionHeader, StatCard, Button, Modal, Input, Select } from "../../components/ui";
import * as savingsService from "../../services/savingsService";
import type { Transaction } from "../../services/savingsService";

export default function SavingsPage() {
  const { t } = useTranslation();
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState({ income: 0, expenses: 0, balance: 0 });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ type: "income", amount: 0, category: "", note: "", date: new Date().toISOString().slice(0, 10) });

  const load = () => {
    savingsService.listTransactions().then(setTxs);
    savingsService.getSummary().then(setSummary);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await savingsService.createTransaction(form as any);
    setOpen(false);
    setForm({ type: "income", amount: 0, category: "", note: "", date: new Date().toISOString().slice(0, 10) });
    load();
  };

  const chartData = [...txs].reverse().reduce<{ date: string; balance: number }[]>((acc, tx) => {
    const prevBalance = acc.length ? acc[acc.length - 1].balance : 0;
    const delta = tx.type === "income" ? tx.amount : -tx.amount;
    acc.push({ date: tx.date, balance: prevBalance + delta });
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="grid grid-cols-2 gap-4 flex-1">
          <StatCard label={t("income")} value={summary.income.toLocaleString()} icon={TrendingUp} accent="#6FCF9E" />
          <StatCard label={t("expenses")} value={summary.expenses.toLocaleString()} icon={Wallet} accent="#F2667A" />
        </div>
      </div>

      <Card className="p-5">
        <SectionHeader title={t("balance") + ": " + summary.balance.toLocaleString()} action={
          <Button onClick={() => setOpen(true)}><span className="flex items-center gap-1.5"><Plus size={15} /> {t("addTransaction")}</span></Button>
        } />
        {chartData.length > 0 && (
          <div className="h-56 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E8A33D" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#E8A33D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="date" stroke="#9C93B8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#9C93B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#241C3D", border: "1px solid #ffffff20", borderRadius: 10 }} />
                <Area type="monotone" dataKey="balance" stroke="#E8A33D" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="space-y-2">
          {txs.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2.5 text-[13px]">
              <span>{tx.note || tx.category || tx.type}</span>
              <span className={tx.type === "income" ? "text-mint" : "text-coral"}>
                {tx.type === "income" ? "+" : "-"}{tx.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={t("addTransaction")}>
        <form onSubmit={submit} className="space-y-3">
          <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="income">{t("income")}</option>
            <option value="expense">{t("expenses")}</option>
          </Select>
          <Input type="number" required min={0} placeholder={t("amount")} value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
          <Input placeholder={t("category")} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Input placeholder={t("note")} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
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
