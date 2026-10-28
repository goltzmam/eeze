import { NextResponse } from "next/server";
export function GET() {
  return NextResponse.json({ service: "eaze Intelligence", status: "ok" });
}
