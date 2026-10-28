import { NextResponse } from "next/server";
import { z } from "zod";
import { authorized, body, failure, checked } from "@/lib/http";
export async function POST(request: Request) {
  try {
    const { db } = await authorized(request);
    const { password } = z
      .object({ password: z.string().min(12).max(128) })
      .parse(await body(request));
    const { error } = await db.auth.updateUser({ password });
    checked(error);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
