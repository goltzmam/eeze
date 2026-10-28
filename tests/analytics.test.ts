import { describe, it, expect } from "vitest";
import { summarize, type Measurement } from "../src/features/analytics/engine";
const sample = (
  date: string,
  value: number,
  extra: Partial<Measurement> = {},
): Measurement => ({
  id: date,
  device_id: "device",
  metric_type: "heart_rate",
  value,
  unit: "bpm",
  measured_at: date,
  source: "validated-test-fixture",
  quality_status: "valid",
  ...extra,
});
const start = new Date("2026-10-10T00:00:00Z"),
  end = new Date("2026-10-17T00:00:00Z");
describe("deterministic analysis", () => {
  it("requires at least three observed days, never fills missing data", () => {
    expect(summarize([], "heart_rate", start, end).mean).toBeNull();
    expect(
      summarize([sample("2026-10-11T12:00:00Z", 60)], "heart_rate", start, end)
        .mean,
    ).toBeNull();
  });
  it("deduplicates, validates units and quality; uses half-open periods", () => {
    const a = sample("2026-10-11T12:00:00Z", 60);
    const rows = [
      a,
      a,
      sample("2026-10-12T12:00:00Z", 70),
      sample("2026-10-13T12:00:00Z", 80),
      sample("2026-10-14T12:00:00Z", 100, { unit: "%" }),
      sample("2026-10-15T12:00:00Z", 90, { quality_status: "uncertain" }),
      sample("2026-10-17T00:00:00Z", 100),
      sample("invalid", 3),
      sample("2026-10-16T12:00:00Z", NaN),
    ];
    const s = summarize(rows, "heart_rate", start, end);
    expect(s.count).toBe(3);
    expect(s.mean).toBe(70);
    expect(s.min).toBe(60);
    expect(s.max).toBe(80);
    expect(s.change).toBeNull();
  });
  it("compares equal previous periods only with sufficient observations", () => {
    const rows = [3, 4, 5, 10, 11, 12].map((d, i) =>
      sample(
        `2026-10-${String(d).padStart(2, "0")}T12:00:00Z`,
        i < 3 ? 60 : 70,
      ),
    );
    const s = summarize(rows, "heart_rate", start, end);
    expect(s.change).toBe(10);
  });
  it("averages days rather than overweighting days with more samples", () => {
    const rows = [
      sample("2026-10-11T12:00:00Z", 60),
      sample("2026-10-11T13:00:00Z", 80),
      sample("2026-10-12T12:00:00Z", 60),
      sample("2026-10-13T12:00:00Z", 80),
    ];
    expect(summarize(rows, "heart_rate", start, end).mean).toBe(70);
  });
  it("rejects invalid periods and physiological impossible values", () => {
    expect(() => summarize([], "heart_rate", end, start)).toThrow();
    expect(
      summarize([sample("2026-10-11T12:00:00Z", 900)], "heart_rate", start, end)
        .count,
    ).toBe(0);
  });
});
