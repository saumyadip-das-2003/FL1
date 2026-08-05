export function getYouTubeId(source?: string) {
  if (!source) {
    return "";
  }

  try {
    const url = new URL(source);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace("/", "");
    }

    if (url.searchParams.get("v")) {
      return url.searchParams.get("v") ?? "";
    }

    const parts = url.pathname.split("/").filter(Boolean);
    const marker = parts.findIndex((part) => ["embed", "shorts", "live"].includes(part));
    if (marker >= 0 && parts[marker + 1]) {
      return parts[marker + 1];
    }
  } catch {
    const directId = source.match(/^[a-zA-Z0-9_-]{8,}$/)?.[0];
    if (directId) {
      return directId;
    }
  }

  return "";
}

export function youtubeEmbedUrl(source?: string, autoplay = true) {
  const id = getYouTubeId(source);
  if (!id) {
    return "";
  }
  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    mute: "1",
    loop: "1",
    playlist: id,
    controls: "0",
    disablekb: "1",
    fs: "0",
    iv_load_policy: "3",
    modestbranding: "1",
    playsinline: "1",
    rel: "0",
    showinfo: "0"
  });

  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}
