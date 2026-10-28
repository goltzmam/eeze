"use client";
import { useEffect, useState } from "react";
interface InstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}
let promptEvent: InstallPrompt | null = null;
export function InstallButton() {
  const [available, setAvailable] = useState(false),
    [message, setMessage] = useState("");
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      promptEvent = e as InstallPrompt;
      setAvailable(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);
  return (
    <div>
      <button
        className="button secondary"
        onClick={async () => {
          if (promptEvent) {
            await promptEvent.prompt();
            const choice = await promptEvent.userChoice;
            setMessage(
              choice.outcome === "accepted"
                ? "Instalação solicitada."
                : "Você pode instalar quando quiser.",
            );
            promptEvent = null;
            setAvailable(false);
          } else
            setMessage(
              "No menu do navegador, escolha “Instalar aplicativo” ou “Adicionar à Tela de Início”.",
            );
        }}
      >
        {available ? "Instalar eaze" : "Como instalar"}
      </button>
      <p className="small" role="status">
        {message}
      </p>
    </div>
  );
}
export function Pwa() {
  const [offline, setOffline] = useState(false),
    [worker, setWorker] = useState<ServiceWorker | null>(null);
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          if (reg.waiting) setWorker(reg.waiting);
          reg.addEventListener("updatefound", () => {
            const installing = reg.installing;
            installing?.addEventListener("statechange", () => {
              if (
                installing.state === "installed" &&
                navigator.serviceWorker.controller
              )
                setWorker(reg.waiting);
            });
          });
        })
        .catch(() => {
          /* App stays usable without persistent caching. */
        });
    }
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  return (
    <>
      {offline && (
        <div className="offline-banner" role="status">
          <strong>Você está offline.</strong> Algumas informações podem não
          estar atualizadas.
        </div>
      )}
      {worker && (
        <div className="pwa-banner">
          <p>
            Uma nova versão está disponível. Salve o que estiver fazendo antes
            de atualizar.
          </p>
          <button
            className="button"
            onClick={() => {
              navigator.serviceWorker.addEventListener(
                "controllerchange",
                () => location.reload(),
                { once: true },
              );
              worker.postMessage({ type: "ACTIVATE" });
            }}
          >
            Atualizar
          </button>
          <button className="text-button" onClick={() => setWorker(null)}>
            Depois
          </button>
        </div>
      )}
    </>
  );
}
