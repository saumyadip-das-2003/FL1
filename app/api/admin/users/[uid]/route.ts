import { NextRequest, NextResponse } from "next/server";
import { protectedAdminEmail } from "@/lib/admin-auth";
import { bearerToken, getFirebaseAdminAuth, isFirebaseAdminConfigured, protectedAdminUid, verifyProtectedOwnerRequestDetailed } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function guard(request: NextRequest) {
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ error: "Firebase Admin service account is not configured." }, { status: 501 });
  }

  const result = await verifyProtectedOwnerRequestDetailed(bearerToken(request.headers.get("authorization")));
  return result.allowed
    ? null
    : NextResponse.json({ error: result.error }, { status: 401 });
}

function errorResponse(error: unknown, fallback: string, status = 500) {
  return NextResponse.json({ error: error instanceof Error ? error.message : fallback }, { status });
}

async function isProtectedUser(uid: string) {
  if (uid === (await protectedAdminUid())) {
    return true;
  }

  try {
    const user = await getFirebaseAdminAuth().getUser(uid);
    return user.email?.toLowerCase() === protectedAdminEmail;
  } catch {
    return false;
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { uid: string } }) {
  try {
    const blocked = await guard(request);
    if (blocked) {
      return blocked;
    }

    const body = (await request.json()) as { email?: string; password?: string; disabled?: boolean };
    const protectedUser = await isProtectedUser(params.uid);
    const update: { email?: string; password?: string; disabled?: boolean } = {};

    if (body.email?.trim()) {
      if (protectedUser && body.email.trim().toLowerCase() !== protectedAdminEmail) {
        return NextResponse.json({ error: "Protected owner email cannot be changed." }, { status: 403 });
      }
      update.email = body.email.trim();
    }

    if (body.password) {
      if (body.password.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
      }
      update.password = body.password;
    }

    if (typeof body.disabled === "boolean") {
      if (protectedUser && body.disabled) {
        return NextResponse.json({ error: "Protected owner account cannot be disabled." }, { status: 403 });
      }
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
        protected: protectedUser || user.email?.toLowerCase() === protectedAdminEmail,
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

    if (await isProtectedUser(params.uid)) {
      return NextResponse.json({ error: "Protected owner account cannot be deleted." }, { status: 403 });
    }

    await getFirebaseAdminAuth().deleteUser(params.uid);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error, "Unable to delete admin user.");
  }
}
