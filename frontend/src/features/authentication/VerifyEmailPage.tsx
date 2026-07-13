import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heart, CheckCircle2, XCircle } from "lucide-react";
import * as authService from "../../services/authService";
import { Card, Button } from "../../components/ui";
import { useAuth } from "../../contexts/AuthContext";

export default function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const { t } = useTranslation();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) return;
    authService
      .verifyEmail(token)
      .then(async () => {
        setStatus("success");
        await refreshUser();
      })
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="min-h-screen w-full bg-bg text-ink flex items-center justify-center font-body p-4">
      <div className="w-full max-w-sm text-center">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-coral flex items-center justify-center">
            <Heart size={19} className="text-bg" fill="#1B1533" />
          </div>
          <div className="font-display font-semibold text-lg">{t("appName")}</div>
        </div>

        <Card className="p-6">
          {status === "loading" && <div className="text-muted text-[14px]">Inathibitisha...</div>}
          {status === "success" && (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle2 size={40} className="text-mint" />
              <div className="text-[15px] font-medium">Barua pepe imethibitishwa!</div>
              <Link to="/"><Button>Nenda kwenye Dashboard</Button></Link>
            </div>
          )}
          {status === "error" && (
            <div className="flex flex-col items-center gap-3">
              <XCircle size={40} className="text-coral" />
              <div className="text-[15px] font-medium">Kiungo hakiko sahihi au kimeisha muda.</div>
              <Link to="/settings"><Button variant="ghost">Tuma tena kutoka Settings</Button></Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
