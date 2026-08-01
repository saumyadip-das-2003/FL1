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

export async function PATCH(request: NextRequest, { params }: { params: { uid: string } }) {
  try {
    const blocked = await guard(request);
    if (blocked) {
      return blocked;
    }

    const body = (await request.json()) as { email?: string; password?: string; disabled?: boolean };
    const update: { email?: string; password?: string; disabled?: boolean } = {};

    if (body.email?.trim()) {
      update.email = body.email.trim();
    }

    if (body.password) {
      if (body.password.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
      }
      update.password = body.password;
    }

    if (typeof body.disabled === "boolean") {
      update.disabled = body.disabled;
    }

    if (!Object.keys(update).length) {
      return NextResponse.json({ error: "No user changes provided." }, { status: 400 });
    }

    const user = await getFirebaseAdminAuth().updateUser(params.uid, update);
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
    return errorResponse(error, "Unable to update admin user.");
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { uid: string } }) {
  try {
    const blocked = await guard(request);
    if (blocked) {
      return blocked;
    }

    await getFirebaseAdminAuth().deleteUser(params.uid);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error, "Unable to delete admin user.");
  }
}
