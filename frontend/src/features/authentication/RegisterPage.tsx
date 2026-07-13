import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { Card, Input, Button } from "../../components/ui";

export default function RegisterPage() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(fullName, email, password);
      navigate("/");
    } catch {
      setError(t("auth.registerError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-display font-semibold mb-4">{t("createAccount")}</h2>
      <form onSubmit={submit} className="space-y-3">
        <Input required placeholder={t("auth.fullName")} value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <Input type="email" required placeholder={t("auth.email")} value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" required minLength={6} placeholder={t("auth.password")} value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <div className="text-[13px] text-coral">{error}</div>}
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "..." : t("auth.register")}</Button>
      </form>
      <div className="text-[13px] text-muted mt-4 text-center">
        {t("auth.haveAccount")}{" "}
        <Link to="/login" className="text-gold">{t("auth.login")}</Link>
      </div>
    </Card>
  );
}
