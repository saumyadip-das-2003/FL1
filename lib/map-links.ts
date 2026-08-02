export function isUrl(value: string) {
  return /^https?:\/\//i.test(value.trim());
}

export function mapOpenUrl(value?: string) {
  const location = (value ?? "").trim();
  return isUrl(location) ? location : "";
}

export function mapEmbedUrl(value?: string) {
  const location = (value ?? "").trim();
  if (!isUrl(location)) {
    return "";
  }

  try {
    const url = new URL(location);

    if (url.hostname === "maps.app.goo.gl") {
      return `/api/map-embed?url=${encodeURIComponent(location)}`;
    }

    const isEmbed = url.pathname.includes("/maps/embed") || url.searchParams.get("output") === "embed";
    if (isEmbed) {
      return location;
    }

    const coordinateMatch = location.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
    if (coordinateMatch) {
      return `https://maps.google.com/maps?q=${coordinateMatch[1]},${coordinateMatch[2]}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }

    const placeMatch = url.pathname.match(/\/maps\/place\/([^/]+)/);
    if (placeMatch?.[1]) {
      const place = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
      return `https://maps.google.com/maps?q=${encodeURIComponent(place)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }

    const query = url.searchParams.get("q") || url.searchParams.get("query");
    if (query) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
  } catch {
    return "";
  }

  return "";
}
