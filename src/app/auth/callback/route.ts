import { NextResponse } from "next/server";
import { database } from "@/lib/supabase/server";
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (code) {
    const db = await database();
    const { error } = await db.auth.exchangeCodeForSession(code);
    if (!error)
      return NextResponse.redirect(
        new URL(
          url.searchParams.get("next") === "/redefinir"
            ? "/redefinir"
            : "/hoje",
          url.origin,
        ),
      );
  }
  return NextResponse.redirect(new URL("/entrar?error=callback", url.origin));
}
