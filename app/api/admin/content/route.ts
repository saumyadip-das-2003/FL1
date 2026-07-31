import { NextRequest, NextResponse } from "next/server";
import { getFirebaseApiKey } from "@/lib/admin-auth";
import { getSanityContent, saveSanityContent } from "@/lib/sanity-http";
import type { AdminContent } from "@/lib/admin-demo-data";

export const dynamic = "force-dynamic";

async function isAuthorized(request: NextRequest) {
  const apiKey = getFirebaseApiKey();

  if (!apiKey) {
    return true;
  }

  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!token) {
    return false;
  }

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: token })
  });

  return response.ok;
}

export async function GET(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const content = await getSanityContent();
  return NextResponse.json({ content });
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const content = (await request.json()) as AdminContent;
  const result = await saveSanityContent(content);

  return NextResponse.json(result);
}
