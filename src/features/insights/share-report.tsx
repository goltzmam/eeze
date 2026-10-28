"use client";
import { useState } from "react";
import { Download } from "lucide-react";
export function ShareReport() {
  const [message, setMessage] = useState("");
  return (
    <div>
      <button
        className="button secondary"
        onClick={async () => {
          const svg =
            '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080"><rect width="1080" height="1080" fill="#f7f7f5"/><text x="90" y="180" font-family="sans-serif" font-size="80">eaze</text><text x="90" y="510" font-family="sans-serif" font-size="60">Evoluindo no meu ritmo.</text><text x="90" y="620" font-family="sans-serif" font-size="30" fill="#767676">Menos tela. Mais vida.</text><text x="90" y="970" font-family="sans-serif" font-size="24">Meus indicadores permanecem privados.</text></svg>';
          const url = URL.createObjectURL(
            new Blob([svg], { type: "image/svg+xml" }),
          );
          const a = document.createElement("a");
          a.href = url;
          a.download = "minha-semana-eaze.svg";
          a.click();
          URL.revokeObjectURL(url);
          setMessage("Card gerado sem informações pessoais ou indicadores.");
        }}
      >
        <Download size={16} />
        Criar card sem dados pessoais
      </button>
      <p role="status" className="small">
        {message}
      </p>
    </div>
  );
}
