import { NextResponse } from "next/server";
import { z } from "zod";
import { authorized, body, checked, failure } from "@/lib/http";
export async function POST(request: Request) {
  try {
    const { db, user } = await authorized(request);
    const input = z
      .object({
        purpose: z.enum(["health_storage", "ai_analysis"]),
        granted: z.boolean(),
      })
      .parse(await body(request));
    const now = new Date().toISOString();
    const { error } = await db.from("consents").upsert(
      {
        user_id: user.id,
        purpose: input.purpose,
        version: "2026-10-28",
        granted_at: now,
        revoked_at: input.granted ? null : now,
      },
      { onConflict: "user_id,purpose" },
    );
    checked(error);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
export async function DELETE(request: Request) {
  try {
    const { db, user } = await authorized(request);
    const { confirmation } = z
      .object({ confirmation: z.literal("EXCLUIR") })
      .parse(await body(request));
    void confirmation;
    const { error } = await db
      .from("deletion_requests")
      .upsert({ user_id: user.id }, { onConflict: "user_id" });
    checked(error);
    return NextResponse.json({
      message:
        "Solicitação registrada. A exclusão da conta será processada pelo responsável pela privacidade.",
    });
  } catch (e) {
    return failure(e);
  }
}
