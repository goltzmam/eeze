export function urgent(message: string) {
  return /dor (no peito|torácica)|falta de ar intensa|desmai|suic[ií]d|me matar|não consigo respirar|sinais de avc/i.test(
    message,
  );
}
export const urgentReply =
  "Se você está com sintomas intensos ou em risco imediato, procure atendimento de urgência agora. No Brasil, ligue 192 (SAMU). Não espere por uma análise da pulseira. Se há risco de se machucar, procure alguém de confiança; o CVV atende pelo 188.";
export function groundedText(
  summary: {
    metric: string;
    mean: number | null;
    days: number;
    start: string;
    end: string;
  }[],
) {
  const available = summary.filter((s) => s.mean !== null);
  return available.length
    ? available
        .map(
          (s) =>
            `${s.metric}: média ${s.mean!.toFixed(1)}, ${s.days} dias observados, de ${s.start} a ${s.end}.`,
        )
        .join(" ")
    : "Ainda não tenho dados suficientes sobre sua rotina. Posso explicar como começar a acompanhar seus indicadores. Conecte uma pulseira com protocolo validado e construa pelo menos três dias de registros válidos. Não é possível inferir seu estado de saúde sem esses dados.";
}
