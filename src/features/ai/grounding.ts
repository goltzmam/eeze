import { z } from "zod";
import {
  metrics,
  formatValue,
  type Summary,
  type Metric,
} from "../analytics/engine";
export const selectionSchema = z
  .object({
    topic: z.enum([
      "general",
      "sleep_minutes",
      "heart_rate",
      "steps",
      "spo2",
      "stress",
    ]),
    intent: z.enum(["summary", "compare", "start"]),
  })
  .strict();
export function parseSelection(content: string) {
  return selectionSchema.parse(JSON.parse(content));
}
export function renderSelection(
  selection: z.infer<typeof selectionSchema>,
  summaries: Summary[],
) {
  const relevant = summaries.filter(
    (s) => selection.topic === "general" || s.metric === selection.topic,
  );
  const available = relevant.filter((s) => s.mean !== null);
  if (selection.intent === "start")
    return "Para começar, confirme a compatibilidade da sua pulseira em Minha eaze. Autorize o armazenamento em Privacidade. Enquanto a integração não estiver validada, você pode criar planos e registrar seus momentos. Não é necessário inventar medições para acompanhar hábitos.";
  if (!available.length)
    return "Ainda não há dias observados suficientes nessa categoria para uma análise. Não vou estimar valores ou tirar conclusões sobre sua saúde.";
  const observations = available.map(
    (s) =>
      `${metrics[s.metric].label}: ${formatValue(s.mean!, s.metric)} ${unit(s.metric)} de média por dia observado, em ${s.days} dias.${selection.intent === "compare" ? (s.change === null ? " Ainda não há dados suficientes no período anterior para comparar." : ` A diferença em relação ao período anterior é ${s.change > 0 ? "+" : ""}${formatValue(s.change, s.metric)} ${unit(s.metric)}.`) : ""}`,
  );
  return (
    "O que observamos\n" +
    observations.join("\n") +
    "\n\nO que isso pode significar\nEstas observações ajudam a acompanhar sua rotina. Mudanças isoladas não explicam causas nem permitem diagnosticar ou descartar doenças.\n\nLimitações\nApenas registros válidos e dias observados são considerados. Dias sem registros não são preenchidos. Consulte abaixo o período e a origem dos dados."
  );
}
function unit(metric: Metric) {
  return metric === "sleep_minutes"
    ? "h"
    : metric === "steps"
      ? "passos"
      : metrics[metric].unit;
}
