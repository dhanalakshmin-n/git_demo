import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "markflow_session";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token || !token.startsWith("dummy_token_")) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: { email: "demo@markflow.com", name: "Demo User" },
  });
}
