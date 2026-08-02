import { NextRequest, NextResponse } from "next/server";
import { mapEmbedUrl } from "@/lib/map-links";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("url") ?? "";

  if (!source) {
    return NextResponse.json({ error: "Missing map URL." }, { status: 400 });
  }

  try {
    const response = await fetch(source, {
      method: "GET",
      redirect: "follow",
      cache: "no-store"
    });
    const expanded = response.url || source;
    const embed = mapEmbedUrl(expanded);

    if (embed && !embed.startsWith("/api/map-embed")) {
      return NextResponse.redirect(embed);
    }
  } catch {
    // Fall through to the readable fallback below.
  }

  const fallback = `https://maps.google.com/maps?q=${encodeURIComponent(source)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  return NextResponse.redirect(fallback);
}
