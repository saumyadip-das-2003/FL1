import { NextRequest, NextResponse } from "next/server";
import { getFirebaseApiKey } from "@/lib/admin-auth";
import { uploadSanityImage } from "@/lib/sanity-http";

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

export async function POST(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No image file provided." }, { status: 400 });
  }

  const url = await uploadSanityImage(file);

  return NextResponse.json({ url });
}
