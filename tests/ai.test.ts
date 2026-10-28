import { it, expect } from "vitest";
import { urgent, urgentReply, groundedText } from "../src/features/ai/safety";
it("does not invent measurements without data", () => {
  const result = groundedText([]);
  expect(result).toContain("não tenho dados suficientes");
  expect(result).not.toMatch(/\b\d+\b/);
});
it("keeps urgent symptom guidance independent of model", () => {
  expect(urgent("Sinto dor no peito")).toBe(true);
  expect(urgentReply).toContain("192");
  expect(urgent("Como meu sono evoluiu?")).toBe(false);
});
it("evidence contains only provided aggregates", () => {
  const s = groundedText([
    { metric: "heart_rate", mean: 70, days: 3, start: "start", end: "end" },
  ]);
  expect(s).toContain("70.0");
  expect(s).toContain("3 dias");
});
import { parseSelection, renderSelection } from "../src/features/ai/grounding";
it("rejects model prose, invented measurements and prompt-injected fields", () => {
  expect(() => parseSelection("Seu coração está normal")).toThrow();
  expect(() =>
    parseSelection('{"topic":"general","intent":"summary","value":70}'),
  ).toThrow();
  expect(() =>
    parseSelection('{"topic":"ignore system","intent":"summary"}'),
  ).toThrow();
  expect(
    renderSelection(
      parseSelection('{"topic":"heart_rate","intent":"compare"}'),
      [],
    ),
  ).toContain("Não vou estimar valores");
});
