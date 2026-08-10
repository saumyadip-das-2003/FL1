import { NextRequest, NextResponse } from "next/server";
import { getFirebaseApiKey } from "@/lib/admin-auth";
import { getSanityContent, saveSanityContent } from "@/lib/sanity-http";
import type { AdminContent } from "@/lib/admin-demo-data";

export const dynamic = "force-dynamic";

const deletableCollections = ["projects", "services", "news", "people"] as const;
type DeletableCollection = (typeof deletableCollections)[number];

function isDeletableCollection(value: string | null): value is DeletableCollection {
  return Boolean(value && deletableCollections.includes(value as DeletableCollection));
}

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

  try {
    const content = await getSanityContent();
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to read admin content." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const content = (await request.json()) as AdminContent;
    const result = await saveSanityContent(content);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save admin content." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const collection = request.nextUrl.searchParams.get("collection");
  const id = request.nextUrl.searchParams.get("id");

  if (!isDeletableCollection(collection) || !id) {
    return NextResponse.json({ error: "A valid collection and item id are required." }, { status: 400 });
  }

  try {
    const content = await getSanityContent();
    const before = content[collection].length;
    const nextContent: AdminContent = {
      ...content,
      [collection]: content[collection].filter((item) => item.id !== id)
    };

    if (nextContent[collection].length === before) {
      return NextResponse.json({ error: "The selected item was not found in Sanity." }, { status: 404 });
    }

    const result = await saveSanityContent(nextContent);

    return NextResponse.json({ ...result, content: nextContent });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete admin content." },
      { status: 500 }
    );
  }
}
