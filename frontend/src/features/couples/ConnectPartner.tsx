import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Input, Button, SectionHeader } from "../../components/ui";
import * as couplesService from "../../services/couplesService";
import { useAuth } from "../../contexts/AuthContext";

/** Optional banner shown to solo users, inviting them to connect a partner.
 *  Never blocks access to the app — solo users can use every feature on their own. */
export default function ConnectPartner({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState<{ id: number; inviter_name: string; invitee_email: string }[]>([]);

  const loadPending = () => couplesService.pendingInvites().then(setPending).catch(() => {});

  useEffect(() => {
    loadPending();
  }, []);

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      await couplesService.sendInvite(email);
      setMessage(t("inviteSent"));
      setEmail("");
    } catch (err: any) {
      setMessage(err?.response?.data?.detail || "Error");
    }
  };

  const accept = async (id: number) => {
    await couplesService.acceptInvite(id);
    await refreshUser();
  };

  return (
    <Card className={compact ? "p-4" : "p-6"}>
      {!compact && <SectionHeader title={t("connectPartner")} />}
      <p className="text-[13px] text-muted mb-3">{t("connectedPrompt")}</p>
      <form onSubmit={invite} className="flex gap-2">
        <Input type="email" required placeholder={t("inviteByEmail")} value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit">{t("sendInvite")}</Button>
      </form>
      {message && <div className="text-[13px] text-gold mt-2">{message}</div>}

      {pending.length > 0 && (
        <div className="mt-4">
          <div className="text-[13px] text-muted mb-2">{t("pendingInvites")}</div>
          <div className="space-y-2">
            {pending.map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2.5">
                <span className="text-[13px]">{p.inviter_name}</span>
                <Button variant="ghost" onClick={() => accept(p.id)}>{t("accept")}</Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
