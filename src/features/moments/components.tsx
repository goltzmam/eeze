"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { request } from "@/lib/client-api";
export function MomentForm({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <form
      className="panel form-stack"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget,
          f = new FormData(form);
        setBusy(true);
        try {
          await request("/api/moments", {
            kind: f.get("kind"),
            mood: Number(f.get("mood")),
            energy: Number(f.get("energy")),
            notes: f.get("notes"),
          });
          form.reset();
          setMessage("Seu momento foi salvo.");
          router.refresh();
        } catch (e) {
          setMessage((e as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2>Como está seu dia?</h2>
      <p className="muted">
        Um pouco de contexto ajuda você a observar sua rotina.
      </p>
      <label>
        Momento
        <select name="kind">
          <option value="checkin">Check-in de bem-estar</option>
          <option value="walk">Caminhada</option>
          <option value="movement">Atividade física</option>
          <option value="caffeine">Consumo de cafeína</option>
          <option value="busy">Dia intenso</option>
          <option value="travel">Viagem</option>
          <option value="rest">Sensação de descanso</option>
          <option value="sleep">Sono fora do horário habitual</option>
        </select>
      </label>
      <div className="form-row">
        {[
          ["mood", "Como me sinto"],
          ["energy", "Minha energia"],
        ].map(([name, title]) => (
          <label key={name}>
            {title}
            <select name={name} defaultValue="3">
              {[1, 2, 3, 4, 5].map((v) => (
                <option key={v} value={v}>
                  {v} — {v === 1 ? "Baixa" : v === 5 ? "Alta" : "Intermediária"}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <label>
        Nota pessoal (opcional)
        <textarea
          name="notes"
          maxLength={1000}
          placeholder="O que você gostaria de lembrar sobre hoje?"
          rows={3}
        />
      </label>
      <button className="button" disabled={!enabled || busy}>
        {busy ? "Salvando…" : "Guardar meu momento"}
        <Plus size={16} />
      </button>
      {!enabled && <Link href="/entrar">Entre para salvar seus momentos</Link>}
      <p role="status">{message}</p>
    </form>
  );
}
