import React from "react";
import type { LucideIcon } from "lucide-react";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-surface border border-white/5 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset] ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, accent }: { label: string; value: string; icon: LucideIcon; accent: string }) {
  return (
    <Card className="p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${accent}22`, color: accent }}>
        <Icon size={20} />
      </div>
      <div>
        <div className="text-[13px] text-muted">{label}</div>
        <div className="text-xl font-semibold text-ink">{value}</div>
      </div>
    </Card>
  );
}

export function ProgressBar({ pct, color = "#E8A33D" }: { pct: number; color?: string }) {
  return (
    <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-ink font-display">{title}</h2>
      {action}
    </div>
  );
}

export function Button({
  children, onClick, variant = "primary", type = "button", className = "", disabled,
}: {
  children: React.ReactNode; onClick?: () => void; variant?: "primary" | "ghost" | "danger";
  type?: "button" | "submit"; className?: string; disabled?: boolean;
}) {
  const styles = {
    primary: "bg-gold text-bg font-medium hover:brightness-110",
    ghost: "bg-white/5 text-ink hover:bg-white/10",
    danger: "bg-coral/15 text-coral hover:bg-coral/25",
  }[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2.5 rounded-xl text-[13px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-white/5 rounded-xl px-3 py-2.5 text-[14px] text-ink outline-none focus:ring-2 focus:ring-gold placeholder:text-muted ${props.className || ""}`}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full bg-white/5 rounded-xl px-3 py-2.5 text-[14px] text-ink outline-none focus:ring-2 focus:ring-gold placeholder:text-muted resize-none ${props.className || ""}`}
    />
  );
}

export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full bg-white/5 rounded-xl px-3 py-2.5 text-[14px] text-ink outline-none focus:ring-2 focus:ring-gold"
    >
      {children}
    </select>
  );
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-surface border border-white/10 p-6">
        <h3 className="text-lg font-display font-semibold text-ink mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}
