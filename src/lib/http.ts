import { NextResponse } from "next/server";
import { database, configured } from "./supabase/server";
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export async function authorized(request: Request) {
  if (request.method !== "GET") {
    const origin = request.headers.get("origin");
    if (
      !origin ||
      origin !== (process.env.APP_ORIGIN || "http://localhost:3000")
    )
      throw new ApiError(403, "Origem não autorizada.");
    if (Number(request.headers.get("content-length") || 0) > 65536)
      throw new ApiError(413, "Solicitação muito grande.");
  }
  if (!configured())
    throw new ApiError(503, "A autenticação ainda não foi configurada.");
  const db = await database();
  const {
    data: { user },
    error,
  } = await db.auth.getUser();
  if (error || !user)
    throw new ApiError(401, "Entre na sua conta para continuar.");
  return { db, user };
}
export async function body(request: Request) {
  const text = await request.text();
  if (new TextEncoder().encode(text).length > 65536)
    throw new ApiError(413, "Solicitação muito grande.");
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new ApiError(400, "JSON inválido.");
  }
}
export function failure(error: unknown) {
  if (error instanceof ApiError)
    return NextResponse.json(
      { error: error.message },
      { status: error.status },
    );
  if (error instanceof Error && error.name === "ZodError")
    return NextResponse.json(
      { error: "Confira os campos informados." },
      { status: 400 },
    );
  return NextResponse.json(
    { error: "Não foi possível concluir. Tente novamente." },
    { status: 500 },
  );
}
export function checked(error: { message: string } | null) {
  if (error)
    throw new ApiError(500, "Não foi possível acessar seus registros.");
}
