import { NextResponse } from "next/server";
import { authorized, checked, failure } from "@/lib/http";
export async function GET(request: Request) {
  try {
    const { db, user } = await authorized(request);
    const output: Record<string, unknown> = {
      exported_at: new Date().toISOString(),
      account: { id: user.id, email: user.email, created_at: user.created_at },
    };
    for (const table of [
      "profiles",
      "devices",
      "device_connections",
      "measurements",
      "sleep_sessions",
      "activities",
      "wellness_checkins",
      "insights",
      "plans",
      "plan_tasks",
      "ai_conversations",
      "ai_messages",
      "consents",
      "audit_logs",
      "deletion_requests",
    ]) {
      const rows: unknown[] = [];
      let start = 0;
      for (;;) {
        const { data, error } = await db
          .from(table)
          .select("*")
          .eq(
            table === "profiles"
              ? "id"
              : table === "audit_logs"
                ? "actor_id"
                : "user_id",
            user.id,
          )
          .order("id")
          .range(start, start + 499);
        checked(error);
        rows.push(...(data || []));
        if (!data || data.length < 500) break;
        start += 500;
      }
      output[table] = rows;
    }
    return new NextResponse(JSON.stringify(output, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="eaze-dados.json"',
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return failure(e);
  }
}
