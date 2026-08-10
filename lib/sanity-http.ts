import { revalidateTag } from "next/cache";
import {
  createSeedAdminContent,
  type AdminContent,
  type AdminNews,
  type AdminPerson,
  type AdminProject,
  type AdminService
} from "@/lib/admin-demo-data";

const sanityApiVersion = "2025-02-19";
const legacyContentDocumentId = "modernAgeStudioContent";
const settingsDocumentId = "modernAgeStudioSettings";
export const siteContentCacheTag = "modern-age-studio-content";

type SanityReadMode = "fresh" | "cached";
type CollectionKey = "projects" | "services" | "news" | "people";
type CollectionItem = AdminProject | AdminService | AdminNews | AdminPerson;
type SplitDocument<T extends CollectionItem = CollectionItem> = {
  _id: string;
  _type: string;
  order?: number;
  content?: T;
};

const collectionTypes: Record<CollectionKey, string> = {
  projects: "siteProject",
  services: "siteService",
  news: "siteNews",
  people: "sitePerson"
};

function getSanityConfig() {
  return {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
    token: process.env.SANITY_API_TOKEN ?? ""
  };
}

function sanityBaseUrl(api = true) {
  const { projectId } = getSanityConfig();
  const host = api ? "api" : "apicdn";
  return `https://${projectId}.${host}.sanity.io/v${sanityApiVersion}`;
}

export function isSanityConfigured() {
  const { projectId, dataset, token } = getSanityConfig();
  return Boolean(projectId && dataset && token);
}

function collectionDocId(key: CollectionKey, id: string) {
  return `modernAgeStudio.${key}.${encodeURIComponent(id).replace(/%/g, "_")}`;
}

function collectionFromType(type: string): CollectionKey | null {
  return (Object.entries(collectionTypes).find(([, value]) => value === type)?.[0] as CollectionKey | undefined) ?? null;
}

function requestOptions(mode: SanityReadMode): RequestInit & { next?: { revalidate?: number; tags?: string[] } } {
  const { token } = getSanityConfig();
  const options: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {
    headers: { Authorization: `Bearer ${token}` }
  };

  if (mode === "cached") {
    options.next = { revalidate: 300, tags: [siteContentCacheTag] };
  } else {
    options.cache = "no-store";
  }

  return options;
}

async function sanityQuery<T>(query: string, mode: SanityReadMode): Promise<T> {
  const { dataset } = getSanityConfig();
  const baseUrl = sanityBaseUrl(mode !== "cached");
  const response = await fetch(`${baseUrl}/data/query/${dataset}?query=${encodeURIComponent(query)}`, requestOptions(mode));

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Unable to read Sanity content. Sanity returned ${response.status}: ${details.slice(0, 220)}`);
  }

  const payload = (await response.json()) as { result: T };
  return payload.result;
}

async function sanityMutate(mutations: unknown[]) {
  const { dataset, token } = getSanityConfig();
  const response = await fetch(`${sanityBaseUrl()}/data/mutate/${dataset}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ mutations })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Unable to save Sanity content. Sanity returned ${response.status}: ${details.slice(0, 220)}`);
  }
}

function composeContent(
  seed: AdminContent,
  settings: AdminContent["settings"] | null | undefined,
  documents: SplitDocument[]
): AdminContent {
  const next: AdminContent = {
    ...seed,
    settings: settings ? { ...seed.settings, ...settings } : seed.settings,
    projects: [],
    services: [],
    news: [],
    people: []
  };

  for (const document of documents) {
    const key = collectionFromType(document._type);
    if (!key || !document.content) {
      continue;
    }

    (next[key] as CollectionItem[]).push(document.content);
  }

  return next;
}

export async function getSanityContent(mode: SanityReadMode = "fresh"): Promise<AdminContent> {
  if (!isSanityConfigured()) {
    return createSeedAdminContent();
  }

  const seed = createSeedAdminContent();
  const splitQuery = `{
    "settings": *[_id == "${settingsDocumentId}"][0].content,
    "items": *[_type in ["${Object.values(collectionTypes).join('","')}"]] | order(order asc) {
      _id,
      _type,
      order,
      content
    },
    "legacy": *[_id == "${legacyContentDocumentId}"][0].content
  }`;
  const result = await sanityQuery<{
    settings?: AdminContent["settings"] | null;
    items?: SplitDocument[];
    legacy?: AdminContent | null;
  }>(splitQuery, mode);

  if (result.settings || (result.items?.length ?? 0) > 0) {
    return composeContent(seed, result.settings, result.items ?? []);
  }

  return result.legacy ?? seed;
}

async function existingCollectionDocIds() {
  const query = `*[_type in ["${Object.values(collectionTypes).join('","')}"]]._id`;
  return sanityQuery<string[]>(query, "fresh");
}

async function hasSplitContent() {
  const query = `count(*[_id == "${settingsDocumentId}" || _type in ["${Object.values(collectionTypes).join('","')}"]])`;
  const count = await sanityQuery<number>(query, "fresh");
  return count > 0;
}

export async function saveSanityContent(content: AdminContent) {
  if (!isSanityConfigured()) {
    return { mode: "demo" as const };
  }

  const desiredIds = new Set<string>();
  const mutations: unknown[] = [
    {
      createOrReplace: {
        _id: settingsDocumentId,
        _type: "siteSettings",
        content: content.settings
      }
    }
  ];

  (Object.keys(collectionTypes) as CollectionKey[]).forEach((key) => {
    content[key].forEach((item, index) => {
      const _id = collectionDocId(key, item.id);
      desiredIds.add(_id);
      mutations.push({
        createOrReplace: {
          _id,
          _type: collectionTypes[key],
          order: index,
          content: item
        }
      });
    });
  });

  const existingIds = await existingCollectionDocIds();
  existingIds
    .filter((id) => !desiredIds.has(id))
    .forEach((id) => {
      mutations.push({ delete: { id } });
    });

  await sanityMutate(mutations);
  revalidateTag(siteContentCacheTag);
  return { mode: "sanity" as const };
}

export async function deleteSanityContentItem(key: CollectionKey, id: string): Promise<AdminContent> {
  if (!isSanityConfigured()) {
    const content = createSeedAdminContent();
    return {
      ...content,
      [key]: content[key].filter((item) => item.id !== id)
    };
  }

  const currentContent = await getSanityContent("fresh");
  const before = currentContent[key].length;
  const nextContent: AdminContent = {
    ...currentContent,
    [key]: currentContent[key].filter((item) => item.id !== id)
  };

  if (nextContent[key].length === before) {
    throw new Error("The selected item was not found in Sanity.");
  }

  if (!(await hasSplitContent())) {
    await saveSanityContent(nextContent);
    return getSanityContent("fresh");
  }

  const documentId = collectionDocId(key, id);
  await sanityMutate([{ delete: { id: documentId } }]);
  revalidateTag(siteContentCacheTag);
  return getSanityContent("fresh");
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
