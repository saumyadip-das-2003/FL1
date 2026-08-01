import { NextRequest, NextResponse } from "next/server";
import { bearerToken, getFirebaseAdminAuth, isFirebaseAdminConfigured, verifyAdminRequest } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function guard(request: NextRequest) {
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ error: "Firebase Admin service account is not configured." }, { status: 501 });
  }

  const allowed = await verifyAdminRequest(bearerToken(request.headers.get("authorization")));
  return allowed ? null : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function errorResponse(error: unknown, fallback: string, status = 500) {
  return NextResponse.json({ error: error instanceof Error ? error.message : fallback }, { status });
}

export async function GET(request: NextRequest) {
  try {
    const blocked = await guard(request);
    if (blocked) {
      return blocked;
    }

    const result = await getFirebaseAdminAuth().listUsers(1000);
    return NextResponse.json({
      users: result.users.map((user) => ({
        uid: user.uid,
        email: user.email ?? "",
        disabled: user.disabled,
        createdAt: user.metadata.creationTime,
        lastSignInAt: user.metadata.lastSignInTime
      }))
    });
  } catch (error) {
    return errorResponse(error, "Unable to load admin users.");
  }
}

export async function POST(request: NextRequest) {
  try {
    const blocked = await guard(request);
    if (blocked) {
      return blocked;
    }

    const body = (await request.json()) as { email?: string; password?: string };
    const email = body.email?.trim();
    const password = body.password ?? "";

    if (!email || password.length < 6) {
      return NextResponse.json({ error: "Email and a minimum 6 character password are required." }, { status: 400 });
    }

    const user = await getFirebaseAdminAuth().createUser({
      email,
      password,
      emailVerified: true,
      disabled: false
    });

    return NextResponse.json({
      user: {
        uid: user.uid,
        email: user.email ?? "",
        disabled: user.disabled,
        createdAt: user.metadata.creationTime,
        lastSignInAt: user.metadata.lastSignInTime
      }
    });
  } catch (error) {
    return errorResponse(error, "Unable to add admin user.");
  }
}
