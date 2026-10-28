"use client";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUp,
  Plus,
  ShieldCheck,
  LoaderCircle,
} from "lucide-react";
import { request } from "@/lib/client-api";
export function Chat({
  enabled,
  initial,
}: {
  enabled: boolean;
  initial: { role: string; content: string; conversation_id: string }[];
}) {
  const [archive, setArchive] = useState(initial);
  const [messages, setMessages] = useState(
      initial.filter(
        (m) => m.conversation_id === initial.at(-1)?.conversation_id,
      ),
    ),
    [text, setText] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [conversationId, setConversationId] = useState<string | undefined>(
    initial.at(-1)?.conversation_id,
  );
  const suggestions = [
    "Como meu sono evoluiu?",
    "Resuma minha última semana.",
    "Quais hábitos estou mantendo?",
  ];
  return (
    <div className="chat">
      {enabled && (
        <div className="conversation-controls">
          <label>
            Conversas recentes
            <select
              aria-label="Conversas recentes"
              value={conversationId || ""}
              disabled={busy}
              onChange={(e) => {
                setConversationId(e.target.value || undefined);
                setMessages(
                  archive.filter((m) => m.conversation_id === e.target.value),
                );
                setError("");
              }}
            >
              <option value="">Nova conversa</option>
              {[...new Set(archive.map((m) => m.conversation_id))].map(
                (cid) => (
                  <option key={cid} value={cid}>
                    {(
                      archive.find(
                        (m) => m.conversation_id === cid && m.role === "user",
                      )?.content || "Conversa"
                    ).slice(0, 65)}
                  </option>
                ),
              )}
            </select>
          </label>
          <button
            className="text-button"
            disabled={busy}
            onClick={() => {
              setConversationId(undefined);
              setMessages([]);
              setError("");
            }}
          >
            Nova conversa <Plus size={16} />
          </button>
        </div>
      )}
      <div className="chat-intro">
        <div className="ai-glyph">✳</div>
        <p className="eyebrow">INTELIGÊNCIA COM CONTEXTO</p>
        <h1>
          Mais clareza.
          <br />
          <span>Um diálogo de cada vez.</span>
        </h1>
        <p>Entenda seus dados. Descubra seus padrões.</p>
      </div>
      {messages.length === 0 ? (
        <>
          <div className="ai-empty">
            <ShieldCheck size={19} />
            <div>
              <strong>
                Ainda não tenho dados suficientes sobre sua rotina.
              </strong>
              <p>
                Posso explicar como começar a acompanhar seus indicadores. Não
                substituo uma avaliação profissional.
              </p>
            </div>
          </div>
          <div className="suggestions">
            {suggestions.map((s) => (
              <button key={s} onClick={() => setText(s)}>
                {s}
                <ArrowRight size={15} />
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="messages" aria-live="polite">
          {messages.map((m, i) => (
            <article key={i} className={"message " + m.role}>
              <span>{m.role === "user" ? "Você" : "eaze AI"}</span>
              <p>{m.content}</p>
            </article>
          ))}
        </div>
      )}
      <form
        className="chat-composer"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!text.trim()) return;
          setBusy(true);
          setError("");
          try {
            const result = await request("/api/ai", {
              message: text,
              conversationId: conversationId,
            });
            setConversationId(result.conversationId);
            const exchange = [
              {
                role: "user",
                content: text,
                conversation_id: result.conversationId,
              },
              {
                role: "assistant",
                content: result.answer,
                conversation_id: result.conversationId,
              },
            ];
            setMessages((m) => [...m, ...exchange]);
            setArchive((m) => [...m, ...exchange]);
            setText("");
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <label className="sr-only" htmlFor="question">
          O que você gostaria de entender hoje?
        </label>
        <textarea
          id="question"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={1500}
          placeholder="O que você gostaria de entender hoje?"
          rows={2}
        />
        <button
          className="icon-button"
          disabled={!enabled || busy || !text.trim()}
          aria-label="Enviar mensagem"
        >
          {busy ? (
            <LoaderCircle className="spin" size={20} />
          ) : (
            <ArrowUp size={20} />
          )}
        </button>
      </form>
      <p className="small muted center">
        {enabled
          ? "A IA pode errar. Observe as fontes e limitações. Até 10 mensagens por hora."
          : "Entre na sua conta e autorize as análises em Você → Privacidade para conversar."}
      </p>
      <p role="status" className="form-message">
        {error}
      </p>
    </div>
  );
}
