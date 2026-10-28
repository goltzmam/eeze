import { NextResponse } from "next/server";
import { z } from "zod";
import { authorized, body, checked, failure } from "@/lib/http";
export async function POST(request: Request) {
  try {
    const { db, user } = await authorized(request);
    const input = z
      .object({
        kind: z.enum([
          "checkin",
          "movement",
          "caffeine",
          "busy",
          "travel",
          "walk",
          "rest",
          "sleep",
        ]),
        mood: z.number().int().min(1).max(5),
        energy: z.number().int().min(1).max(5),
        notes: z.string().trim().max(1000),
      })
      .parse(await body(request));
    const { data, error } = await db
      .from("wellness_checkins")
      .insert({ ...input, user_id: user.id })
      .select("id")
      .single();
    checked(error);
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    return failure(e);
  }
}
