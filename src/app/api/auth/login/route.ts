import { NextResponse } from "next/server";

const COOKIE_NAME = "markflow_session";

/** Dummy credentials for demo login */
const DUMMY_USERS = [
  { email: "demo@markflow.com", password: "demo123", name: "Demo User" },
  { email: "user@markflow.com", password: "password123", name: "Markflow User" },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = DUMMY_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = `dummy_token_${Date.now()}_${user.email}`;
    const res = NextResponse.json({
      success: true,
      user: { email: user.email, name: user.name },
    });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return res;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
