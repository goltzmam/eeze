import { NextResponse } from "next/server";
import { z } from "zod";
import { authorized, body, checked, failure } from "@/lib/http";
export async function POST(request: Request) {
  try {
    const { db } = await authorized(request);
    const input = z
      .object({
        goal: z.enum(["sleep", "movement", "balance"]),
        days: z.number().int().min(3).max(30),
        time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
      })
      .parse(await body(request));
    const { data, error } = await db.rpc("create_habit_plan", {
      p_goal: input.goal,
      p_days: input.days,
      p_time: input.time,
    });
    checked(error);
    return NextResponse.json({ id: data }, { status: 201 });
  } catch (e) {
    return failure(e);
  }
}
export async function PATCH(request: Request) {
  try {
    const { db, user } = await authorized(request);
    const input = z
      .object({ id: z.uuid(), completed: z.boolean() })
      .parse(await body(request));
    const { data, error } = await db
      .from("plan_tasks")
      .update({
        completed_at: input.completed ? new Date().toISOString() : null,
      })
      .eq("id", input.id)
      .eq("user_id", user.id)
      .select("id")
      .single();
    checked(error);
    return NextResponse.json(data);
  } catch (e) {
    return failure(e);
  }
}
