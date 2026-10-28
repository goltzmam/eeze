import { Moon, Heart, Footprints, Wind, Activity } from "lucide-react";
import {
  metrics,
  formatValue,
  type Summary,
} from "@/features/analytics/engine";
import HealthChart from "./health-chart";
const icons = {
  sleep_minutes: Moon,
  heart_rate: Heart,
  spo2: Wind,
  steps: Footprints,
  stress: Activity,
};
export function MetricGrid({
  summaries,
  detail = false,
}: {
  summaries: Summary[];
  detail?: boolean;
}) {
  const available = summaries.filter((s) => s.count > 0);
  return (
    <div className={detail ? "health-grid" : "metrics-grid"}>
      {available.map((s) => {
        const Icon = icons[s.metric];
        return (
          <article key={s.metric} className="panel metric-card">
            <div className="metric-label">
              <span>
                <Icon size={18} />
                {metrics[s.metric].label}
              </span>
              <span className="small">{s.days} dias</span>
            </div>
            <div className="metric-value">
              {s.mean === null ? "—" : formatValue(s.mean, s.metric)}
              <small>
                {s.metric === "sleep_minutes"
                  ? "h"
                  : metrics[s.metric].unit === "steps"
                    ? "passos"
                    : metrics[s.metric].unit}
              </small>
            </div>
            <p className="small muted">
              {s.mean === null
                ? "Ao menos 3 dias válidos para calcular a média"
                : "Média por dia observado no período"}
            </p>
            {detail && (
              <HealthChart points={s.points} unit={metrics[s.metric].unit} />
            )}
            <p className="small">
              {s.change === null
                ? "Histórico anterior ainda insuficiente."
                : `${s.change > 0 ? "+" : ""}${formatValue(s.change, s.metric)} em relação ao período anterior.`}
            </p>
            {detail && (
              <>
                <p className="small muted">
                  Origem: {s.sources.join(", ")}. Apenas medições com qualidade
                  válida.
                </p>
                <p className="small muted">
                  {new Date(s.start).toLocaleDateString("pt-BR")} –{" "}
                  {new Date(s.end).toLocaleDateString("pt-BR")}. Dados ausentes
                  não são preenchidos. Tendências não indicam diagnóstico.
                </p>
              </>
            )}
          </article>
        );
      })}
    </div>
  );
}
