import { NextResponse } from "next/server";
import { z } from "zod";
import { database, configured } from "@/lib/supabase/server";
import { ApiError, body, failure } from "@/lib/http";
const schema = z.object({
  mode: z.enum(["login", "signup", "logout", "reset"]),
  email: z.email().max(254).optional(),
  password: z.string().min(12).max(128).optional(),
});
export async function POST(request: Request) {
  try {
    if (
      request.headers.get("origin") !==
      (process.env.APP_ORIGIN || "http://localhost:3000")
    )
      throw new ApiError(403, "Origem não autorizada.");
    if (!configured())
      throw new ApiError(
        503,
        "O acesso à conta depende da configuração do Supabase.",
      );
    const input = schema.parse(await body(request));
    const db = await database();
    const origin = process.env.APP_ORIGIN || "http://localhost:3000";
    if (input.mode === "logout") {
      const { error } = await db.auth.signOut();
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }
    if (!input.email) throw new ApiError(400, "Informe seu e-mail.");
    if (input.mode === "reset") {
      await db.auth.resetPasswordForEmail(input.email, {
        redirectTo: origin + "/auth/callback?next=/redefinir",
      });
      return NextResponse.json({
        message: "Se houver uma conta, enviaremos as instruções.",
      });
    }
    if (!input.password)
      throw new ApiError(400, "Informe sua senha (mínimo de 12 caracteres).");
    const result =
      input.mode === "signup"
        ? await db.auth.signUp({
            email: input.email,
            password: input.password,
            options: { emailRedirectTo: origin + "/auth/callback" },
          })
        : await db.auth.signInWithPassword({
            email: input.email,
            password: input.password,
          });
    if (result.error)
      throw new ApiError(
        400,
        "Não foi possível entrar ou criar a conta. Confira os dados e seu e-mail.",
      );
    return NextResponse.json({ ok: true, confirmation: !result.data.session });
  } catch (e) {
    return failure(e);
  }
}
