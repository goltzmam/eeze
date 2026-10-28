"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="legal-page">
      <h1>Vamos tentar de novo.</h1>
      <p>
        Não foi possível carregar este espaço. Seus registros não foram
        alterados.
      </p>
      <button className="button" onClick={reset}>
        Tentar novamente
      </button>
    </main>
  );
}
