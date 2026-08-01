import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { protectedAdminEmail } from "@/lib/admin-auth";

function getServiceAccount() {
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (rawJson) {
    const json = rawJson.trim().startsWith("{") ? rawJson : Buffer.from(rawJson, "base64").toString("utf8");
    const parsed = JSON.parse(json) as { project_id?: string; client_email?: string; private_key?: string };

    return {
      projectId: parsed.project_id,
      clientEmail: parsed.client_email,
      privateKey: parsed.private_key?.replace(/\\n/g, "\n")
    };
  }

  return {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
  };
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
