import { createSeedAdminContent, type AdminContent } from "@/lib/admin-demo-data";

const sanityApiVersion = "2025-02-19";
const contentDocumentId = "modernAgeStudioContent";

function getSanityConfig() {
  return {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
    token: process.env.SANITY_API_TOKEN ?? ""
  };
}

function sanityBaseUrl() {
  const { projectId } = getSanityConfig();
  return `https://${projectId}.api.sanity.io/v${sanityApiVersion}`;
}

export function isSanityConfigured() {
  const { projectId, dataset, token } = getSanityConfig();
  return Boolean(projectId && dataset && token);
}

export async function getSanityContent(): Promise<AdminContent> {
  if (!isSanityConfigured()) {
    return createSeedAdminContent();
  }

  const { dataset, token } = getSanityConfig();
  const query = encodeURIComponent(`*[_id == "${contentDocumentId}"][0].content`);
  const response = await fetch(`${sanityBaseUrl()}/data/query/${dataset}?query=${query}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Unable to read Sanity content.");
  }

  const payload = (await response.json()) as { result?: AdminContent };
  return payload.result ?? createSeedAdminContent();
}

export async function saveSanityContent(content: AdminContent) {
  if (!isSanityConfigured()) {
    return { mode: "demo" as const };
  }

  const { dataset, token } = getSanityConfig();
  const document = {
    _id: contentDocumentId,
    _type: "siteContent",
    content
  };

  const response = await fetch(`${sanityBaseUrl()}/data/mutate/${dataset}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      mutations: [{ createOrReplace: document }]
    })
  });

  if (!response.ok) {
    throw new Error("Unable to save Sanity content.");
  }

  return { mode: "sanity" as const };
}

export async function uploadSanityImage(file: File) {
  if (!isSanityConfigured()) {
    throw new Error("Sanity is not configured.");
  }

  const { dataset, token } = getSanityConfig();
  const response = await fetch(`${sanityBaseUrl()}/assets/images/${dataset}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": file.type || "application/octet-stream"
    },
    body: file
  });

  if (!response.ok) {
    throw new Error("Unable to upload image to Sanity.");
  }

  const payload = (await response.json()) as { document?: { url?: string } };
  const url = payload.document?.url;

  if (!url) {
    throw new Error("Sanity did not return an image URL.");
  }

  return url;
}
