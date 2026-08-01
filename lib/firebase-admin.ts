import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { protectedAdminEmail } from "@/lib/admin-auth";

function normalizePrivateKey(value?: string) {
  if (!value) {
    return value;
  }

  let key = value.trim();

  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }

  key = key.replace(/\\n/g, "\n");

  if (!key.includes("\n") && key.includes("-----BEGIN PRIVATE KEY-----")) {
    key = key
      .replace("-----BEGIN PRIVATE KEY-----", "-----BEGIN PRIVATE KEY-----\n")
      .replace("-----END PRIVATE KEY-----", "\n-----END PRIVATE KEY-----\n");
  }

  return key;
}

function getServiceAccount() {
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (rawJson) {
    let json = rawJson.trim();

    if (
      (json.startsWith("'") && json.endsWith("'")) ||
      (json.startsWith('"') && json.endsWith('"') && !json.startsWith("{"))
    ) {
      json = json.slice(1, -1);
    }

    json = json.startsWith("{") ? json : Buffer.from(json, "base64").toString("utf8");
    const parsed = JSON.parse(json) as { project_id?: string; client_email?: string; private_key?: string };

    return {
      projectId: parsed.project_id,
      clientEmail: parsed.client_email,
      privateKey: normalizePrivateKey(parsed.private_key)
    };
  }

  return {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY)
  };
}

function decodedTokenPayload(token: string) {
  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return JSON.parse(Buffer.from(padded, "base64").toString("utf8")) as {
      aud?: string;
      email?: string;
      exp?: number;
      iss?: string;
    };
  } catch {
    return null;
  }
}

function serviceAccountProjectId() {
  try {
    return getServiceAccount().projectId ?? "";
  } catch {
    return "";
  }
}

export function isFirebaseAdminConfigured() {
  try {
    const account = getServiceAccount();
    return Boolean(account.projectId && account.clientEmail && account.privateKey);
  } catch {
    return false;
  }
}

export function getFirebaseAdminAuth() {
  if (!isFirebaseAdminConfigured()) {
    throw new Error("Firebase Admin service account is not configured.");
  }

  if (!getApps().length) {
    initializeApp({
      credential: cert(getServiceAccount())
    });
  }

  return getAuth();
}

export async function verifyAdminRequest(token?: string) {
  if (!token) {
    return false;
  }

  try {
    const decoded = await getFirebaseAdminAuth().verifyIdToken(token);
    return Boolean(decoded.email);
  } catch {
    return false;
  }
}

export async function verifyProtectedOwnerRequest(token?: string) {
  if (!token) {
    return false;
  }

  try {
    const decoded = await getFirebaseAdminAuth().verifyIdToken(token);
    return decoded.email?.toLowerCase() === protectedAdminEmail;
  } catch {
    return false;
  }
}

export async function verifyProtectedOwnerRequestDetailed(token?: string) {
  if (!token) {
    return { allowed: false, error: "Unauthorized. No Firebase login token was sent with this request." };
  }

  const decodedPayload = decodedTokenPayload(token);
  const expectedProjectId = serviceAccountProjectId();
  const tokenProjectId = decodedPayload?.aud ?? "";
  const tokenEmail = decodedPayload?.email?.toLowerCase() ?? "";

  if (decodedPayload?.exp && decodedPayload.exp * 1000 < Date.now()) {
    return { allowed: false, error: "Unauthorized. The Firebase login token is expired. Log out and log in again." };
  }

  if (tokenProjectId && expectedProjectId && tokenProjectId !== expectedProjectId) {
    return {
      allowed: false,
      error: `Unauthorized. Firebase client project is "${tokenProjectId}", but Firebase Admin project is "${expectedProjectId}". Use the same Firebase project for NEXT_PUBLIC_FIREBASE_API_KEY and Firebase Admin credentials.`
    };
  }

  try {
    const decoded = await getFirebaseAdminAuth().verifyIdToken(token);
    const email = decoded.email?.toLowerCase() ?? "";

    if (email !== protectedAdminEmail) {
      return {
        allowed: false,
        error: `Unauthorized. This token belongs to ${email || "an account without an email"}, not ${protectedAdminEmail}.`
      };
    }

    return { allowed: true, error: "" };
  } catch (error) {
    return {
      allowed: false,
      error: `Unauthorized. Firebase Admin could not verify this login token${tokenEmail ? ` for ${tokenEmail}` : ""}. ${
        error instanceof Error ? error.message : "Check Firebase Admin environment variables."
      }`
    };
  }
}

export async function protectedAdminUid() {
  try {
    const user = await getFirebaseAdminAuth().getUserByEmail(protectedAdminEmail);
    return user.uid;
  } catch {
    return "";
  }
}

export function bearerToken(value: string | null) {
  return value?.replace(/^Bearer\s+/i, "") ?? "";
}
