"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, LoaderCircle, LogOut } from "lucide-react";
import { request } from "@/lib/client-api";
export function AuthForm({
  mode = "login",
  configured,
}: {
  mode?: "login" | "signup" | "reset" | "password";
  configured: boolean;
}) {
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const router = useRouter();
  return (
    <form
      className="form-stack"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setMessage("");
        const form = new FormData(e.currentTarget);
        try {
          const result = await request(
            mode === "password" ? "/api/account/password" : "/api/auth",
            {
              mode,
              email: form.get("email") || undefined,
              password: form.get("password") || undefined,
            },
          );
          if (result.confirmation || mode === "reset") {
            setMessage(
              mode === "reset"
                ? result.message
                : "Confira seu e-mail para confirmar sua conta.",
            );
          } else {
            router.push("/hoje");
            router.refresh();
          }
        } catch (e) {
          setMessage((e as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      {mode !== "password" && (
        <label>
          E-mail
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            required
            maxLength={254}
          />
        </label>
      )}
      {mode !== "reset" && (
        <label>
          Senha
          <input
            name="password"
            type="password"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            minLength={12}
            maxLength={128}
            placeholder="Pelo menos 12 caracteres"
            required
          />
        </label>
      )}
      {mode === "signup" && (
        <label className="checkbox-label">
          <input required type="checkbox" />
          Li os <Link href="/termos">termos</Link> e a{" "}
          <Link href="/privacidade">política de privacidade</Link>.
        </label>
      )}
      {!configured && (
        <p className="notice">
          O acesso à conta está indisponível até a configuração segura do
          Supabase.
        </p>
      )}
      <button disabled={busy || !configured} className="button wide">
        {busy ? (
          <LoaderCircle className="spin" size={18} />
        ) : mode === "signup" ? (
          "Criar minha conta"
        ) : mode === "reset" ? (
          "Enviar instruções"
        ) : mode === "password" ? (
          "Salvar nova senha"
        ) : (
          "Entrar"
        )}
        <ArrowRight size={17} />
      </button>
      <p role="status" className="form-message">
        {message}
      </p>
    </form>
  );
}

export function Logout() {
  const router = useRouter();
  const [error, setError] = useState("");
  return (
    <>
      <button
        className="text-button"
        onClick={async () => {
          try {
            await request("/api/auth", { mode: "logout" });
            router.push("/entrar");
            router.refresh();
          } catch (e) {
            setError((e as Error).message);
          }
        }}
      >
        <LogOut size={17} />
        Sair da conta
      </button>
      <p role="status">{error}</p>
    </>
  );
}
