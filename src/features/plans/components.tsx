"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, ArrowRight, Check } from "lucide-react";
import { request } from "@/lib/client-api";
export function PlanBuilder({ enabled }: { enabled: boolean }) {
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const router = useRouter();
  return (
    <form
      className="panel form-stack"
      onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        setBusy(true);
        try {
          await request("/api/plans", {
            goal: f.get("goal"),
            days: Number(f.get("days")),
            time: f.get("time"),
          });
          setMessage("Plano criado. Um passo de cada vez.");
          router.refresh();
        } catch (e) {
          setMessage((e as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="section-title">
        <h2>Uma rotina que combine com você.</h2>
        <Plus size={20} />
      </div>
      <p className="muted">
        Escolha uma intenção. Vamos transformá-la em pequenos passos, sem metas
        clínicas.
      </p>
      <label>
        Meu objetivo
        <select name="goal">
          <option value="sleep">Desacelerar antes de dormir</option>
          <option value="movement">Criar pausas para me movimentar</option>
          <option value="balance">Prestar atenção ao meu bem-estar</option>
        </select>
      </label>
      <div className="form-row">
        <label>
          Duração
          <select name="days">
            <option value="7">7 dias</option>
            <option value="14">14 dias</option>
            <option value="21">21 dias</option>
          </select>
        </label>
        <label>
          Horário preferido
          <input name="time" type="time" defaultValue="20:00" required />
        </label>
      </div>
      <p className="small muted">
        O horário organiza as tarefas; notificações automáticas ainda não estão
        disponíveis.
      </p>
      <button className="button" disabled={!enabled || busy}>
        {busy ? "Criando…" : "Confirmar meu plano"}
        <ArrowRight size={16} />
      </button>
      {!enabled && (
        <Link href="/entrar" className="text-link">
          Entre para criar seu plano
        </Link>
      )}
      <p role="status" className="form-message">
        {message}
      </p>
    </form>
  );
}

export function TaskToggle({
  id,
  title,
  done,
  date,
}: {
  id: string;
  title: string;
  done: boolean;
  date: string;
}) {
  const router = useRouter();
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <div>
      <button
        className={"task " + (done ? "done" : "")}
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await request("/api/plans", { id, completed: !done }, "PATCH");
            router.refresh();
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
        aria-pressed={done}
      >
        <span className="task-check">{done && <Check size={15} />}</span>
        <span>
          {title}
          <small>
            {new Date(date + "T12:00:00").toLocaleDateString("pt-BR")}
          </small>
        </span>
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
