// @vitest-environment jsdom
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { afterEach, it, expect, vi } from "vitest";
import { PlanBuilder, AuthForm } from "../src/components/interactive";
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it("account form never offers pretend auth before configuration", () => {
  render(<AuthForm configured={false} />);
  expect(
    (screen.getByRole("button", { name: /Entrar/ }) as HTMLButtonElement)
      .disabled,
  ).toBe(true);
  expect(screen.getByLabelText("E-mail")).toBeTruthy();
  expect(screen.getByLabelText("Senha")).toBeTruthy();
});
it("plan creation submits chosen preferences and exposes server failure", async () => {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: false,
    json: async () => ({ error: "Sessão expirada." }),
  });
  vi.stubGlobal("fetch", fetchMock);
  render(<PlanBuilder enabled />);
  fireEvent.change(screen.getByLabelText("Meu objetivo"), {
    target: { value: "movement" },
  });
  fireEvent.click(screen.getByRole("button", { name: /Confirmar meu plano/ }));
  await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
    goal: "movement",
    days: 7,
    time: "20:00",
  });
  await screen.findByText("Sessão expirada.");
});
import { Chat } from "../src/components/interactive";
it("keeps persisted conversations separate and can start a new one", () => {
  render(
    <Chat
      enabled
      initial={[
        {
          role: "user",
          content: "Primeira conversa isolada",
          conversation_id: "one",
        },
        {
          role: "assistant",
          content: "Resposta inicial",
          conversation_id: "one",
        },
        {
          role: "user",
          content: "Segunda conversa isolada",
          conversation_id: "two",
        },
      ]}
    />,
  );
  expect(screen.queryByText("Resposta inicial")).toBeNull();
  fireEvent.change(
    screen.getByRole("combobox", { name: "Conversas recentes" }),
    { target: { value: "one" } },
  );
  expect(screen.getByText("Resposta inicial")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: /Nova conversa/ }));
  expect(screen.queryByText("Resposta inicial")).toBeNull();
  expect(
    screen.getByText("Ainda não tenho dados suficientes sobre sua rotina."),
  ).toBeTruthy();
});
