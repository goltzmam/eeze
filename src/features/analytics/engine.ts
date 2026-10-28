export const metrics = {
  heart_rate: { label: "Coração", unit: "bpm" },
  spo2: { label: "Oxigenação", unit: "%" },
  steps: { label: "Atividade", unit: "steps" },
  sleep_minutes: { label: "Sono", unit: "min" },
  stress: { label: "Estresse", unit: "score" },
} as const;
export type Metric = keyof typeof metrics;
export interface Measurement {
  id: string;
  device_id: string;
  metric_type: Metric;
  value: number;
  unit: string;
  measured_at: string;
  quality_status: string;
  source: string;
}
export interface Summary {
  metric: Metric;
  count: number;
  days: number;
  mean: number | null;
  min: number | null;
  max: number | null;
  previousMean: number | null;
  change: number | null;
  start: string;
  end: string;
  sources: string[];
  points: { date: string; value: number }[];
}
export function summarize(
  rows: Measurement[],
  metric: Metric,
  start: Date,
  end: Date,
): Summary {
  if (!Number.isFinite(+start) || !Number.isFinite(+end) || +end <= +start)
    throw new Error("Invalid period");
  const seen = new Set<string>();
  const filtered = rows.filter((r) => {
    const key = [r.device_id, r.metric_type, r.measured_at, r.source].join("|");
    const max = {
      heart_rate: 300,
      spo2: 100,
      steps: 200000,
      sleep_minutes: 1440,
      stress: 100,
    }[metric];
    if (
      r.metric_type !== metric ||
      r.unit !== metrics[metric].unit ||
      r.quality_status !== "valid" ||
      !Number.isFinite(Number(r.value)) ||
      Number(r.value) < 0 ||
      Number(r.value) > max ||
      !Number.isFinite(Date.parse(r.measured_at)) ||
      seen.has(key)
    )
      return false;
    seen.add(key);
    return true;
  });
  const group = (from: number, to: number) =>
    filtered.filter(
      (r) =>
        Date.parse(r.measured_at) >= from && Date.parse(r.measured_at) < to,
    );
  const current = group(+start, +end),
    previous = group(+start - (+end - +start), +start);
  const daily = (items: Measurement[]) => {
    const groups = new Map<string, number[]>();
    for (const r of items) {
      const day = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(r.measured_at));
      groups.set(day, [...(groups.get(day) || []), Number(r.value)]);
    }
    return [...groups]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, values]) => ({
        date,
        value:
          values.reduce((a, b) => a + b, 0) /
          (metric === "steps" || metric === "sleep_minutes"
            ? 1
            : values.length),
      }));
  };
  const points = daily(current),
    old = daily(previous);
  const mean = (items: { value: number }[]) =>
    items.length >= 3
      ? items.reduce((a, b) => a + b.value, 0) / items.length
      : null;
  const avg = mean(points),
    prev = mean(old);
  return {
    metric,
    count: current.length,
    days: points.length,
    mean: avg,
    min: current.length
      ? Math.min(...current.map((r) => Number(r.value)))
      : null,
    max: current.length
      ? Math.max(...current.map((r) => Number(r.value)))
      : null,
    previousMean: prev,
    change: avg !== null && prev !== null ? avg - prev : null,
    start: start.toISOString(),
    end: end.toISOString(),
    sources: [...new Set(current.map((r) => r.source))],
    points,
  };
}
export function weeklySummary(rows: Measurement[], now = new Date(), days = 7) {
  return (Object.keys(metrics) as Metric[]).map((metric) =>
    summarize(rows, metric, new Date(+now - days * 86400000), now),
  );
}
export function formatValue(value: number, metric: Metric) {
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: metric === "heart_rate" ? 0 : 1,
  }).format(metric === "sleep_minutes" ? value / 60 : value);
}
