"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Download } from "lucide-react";
import { request } from "@/lib/client-api";
export function PrivacyControls({
  enabled,
  consents,
}: {
  enabled: boolean;
  consents: { purpose: string; revoked_at: string | null }[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <div className="form-stack">
      <div className="panel">
        <h2>Suas escolhas, sempre.</h2>
        <p className="muted">
          Autorizações independentes. Você pode mudar de ideia a qualquer
          momento.
        </p>
        {[
          {
            key: "health_storage",
            title: "Armazenar indicadores da pulseira",
            text: "Guardar registros na sua conta para construir seu histórico.",
          },
          {
            key: "ai_analysis",
            title: "Utilizar dados nas análises de IA",
            text: "Compartilhar somente resumos agregados com o provedor configurado. As conversas também ficam na sua conta.",
          },
        ].map((item) => {
          const active = consents.some(
            (c) => c.purpose === item.key && !c.revoked_at,
          );
          return (
            <div key={item.key} className="setting-row">
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
              <button
                role="switch"
                aria-checked={active}
                aria-label={item.title}
                className={"switch " + (active ? "on" : "")}
                disabled={!enabled || busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    await request("/api/privacy", {
                      purpose: item.key,
                      granted: !active,
                    });
                    setMessage(
                      "Preferência salva. Revogar não exclui os registros anteriores.",
                    );
                    router.refresh();
                  } catch (e) {
                    setMessage((e as Error).message);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <span />
              </button>
            </div>
          );
        })}
      </div>
      <div className="panel">
        <h2>Seus dados pertencem a você.</h2>
        <p className="muted">
          Exporte seus registros em JSON ou solicite a exclusão da conta e dos
          dados. A solicitação de exclusão requer processamento pelo responsável
          pela privacidade.
        </p>
        <div className="button-row">
          {enabled ? (
            <a className="button secondary" href="/api/privacy/export">
              <Download size={16} />
              Exportar meus dados
            </a>
          ) : (
            <Link className="button secondary" href="/entrar">
              Entre para exportar
            </Link>
          )}
        </div>
        <form
          className="form-stack deletion"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              const data = await request(
                "/api/privacy",
                {
                  confirmation: new FormData(e.currentTarget).get(
                    "confirmation",
                  ),
                },
                "DELETE",
              );
              setMessage(data.message);
            } catch (e) {
              setMessage((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            Para solicitar exclusão, digite EXCLUIR
            <input
              name="confirmation"
              pattern="EXCLUIR"
              placeholder="EXCLUIR"
              required
            />
          </label>
          <button className="text-button danger" disabled={!enabled || busy}>
            Solicitar exclusão da conta
          </button>
        </form>
      </div>
      <p role="status">{message}</p>
    </div>
  );
}
