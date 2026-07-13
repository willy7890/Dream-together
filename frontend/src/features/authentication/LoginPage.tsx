import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { Card, Input, Button } from "../../components/ui";

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError(t("auth.loginError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-display font-semibold mb-4">{t("welcomeBack")}</h2>
      <form onSubmit={submit} className="space-y-3">
        <Input type="email" required placeholder={t("auth.email")} value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" required placeholder={t("auth.password")} value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <div className="text-[13px] text-coral">{error}</div>}
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "..." : t("auth.login")}</Button>
      </form>
      <div className="text-[13px] text-muted mt-4 text-center">
        {t("auth.noAccount")}{" "}
        <Link to="/register" className="text-gold">{t("auth.register")}</Link>
      </div>
    </Card>
  );
}
