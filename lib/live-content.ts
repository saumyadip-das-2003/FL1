import {
  createSeedAdminContent,
  type AdminAboutMessage,
  type AdminContent,
  type AdminLinkItem,
  type AdminNews,
  type AdminPerson,
  type AdminProject,
  type AdminService,
  type AdminTextItem
} from "@/lib/admin-demo-data";
import { cache } from "react";
import { getSanityContent } from "@/lib/sanity-http";
import type { Project, ProjectCategory, ProjectSection } from "@/lib/data";
import type { NewsItem } from "@/lib/news";

export const getLiveContent = cache(async (): Promise<AdminContent> => {
  try {
    return await getSanityContent("fresh");
  } catch {
    return createSeedAdminContent();
  }
});

function categoryFromSection(section: string): ProjectCategory {
  if (section === "Interiors") {
    return "Interior";
  }

  if (section === "Landscape") {
    return "Landscape";
  }

  return "Architecture";
}

export function adminProjectToProject(project: AdminProject): Project {
  const imageMedia = project.media.filter((media) => media.type === "image" && media.source.trim());
  const firstVideo = project.media.find((media) => media.type === "video" && media.source.trim());

  return {
    slug: project.id,
    title: project.title,
    location: project.location,
    year: project.year,
    client: project.client,
    status: project.status,
    category: categoryFromSection(project.section),
    section: project.section as ProjectSection,
    subsection: project.subsection,
    image: project.image,
    gallery: imageMedia.map((media) => media.source).filter((source) => source && source !== project.image),
    media: project.media.filter((media) => media.type === "caption" || media.source.trim()).map((media) => ({
      type: media.type,
      source: media.source,
      caption: media.caption
    })),
    mapLocation: project.mapLocation,
    excerpt: project.description.split(". ")[0] ?? project.description,
    description: project.description,
    video: firstVideo?.source
  };
}

export function adminNewsToNewsItem(item: AdminNews): NewsItem {
  const body = item.description
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return {
    slug: item.id,
    title: item.title,
    date: item.date,
    category: item.category,
    image: item.image,
    gallery: item.gallery
      .split(/\n+/)
      .map((image) => image.trim())
      .filter(Boolean),
    excerpt: body[0] ?? item.description,
    body: body.length > 0 ? body : [item.description]
  };
}

export function adminServiceTags(service: AdminService) {
  return service.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function adminPersonToTeamMember(person: AdminPerson) {
  return {
    name: person.name,
    category: person.category,
    role: person.role,
    image: person.image,
    bio: person.bio,
    studio: person.studio,
    office: person.office,
    profile: person.profile
  };
}

export function parseAboutMessages(content: AdminContent): AdminAboutMessage[] {
  try {
    const parsed = JSON.parse(content.settings.aboutMessages || "[]") as AdminAboutMessage[];
    if (Array.isArray(parsed) && parsed.length) {
      return parsed.map((message) => ({
        id: message.id,
        name: message.name,
        role: message.role,
        image: message.image,
        message: message.message
      }));
    }
  } catch {
    // Fall back to the legacy single founder fields below.
  }

  return [
    {
      id: "founder-message",
      name: "Founder",
      role: "Founder",
      image: content.settings.founderImage,
      message: content.settings.founderMessage
    }
  ];
}

export function parseTextItems(value?: string): AdminTextItem[] {
  try {
    const parsed = JSON.parse(value || "[]") as AdminTextItem[];
    return Array.isArray(parsed) ? parsed.filter((item) => item.title || item.body) : [];
  } catch {
    return [];
  }
}

export function parseLinkItems(value?: string): AdminLinkItem[] {
  try {
    const parsed = JSON.parse(value || "[]") as AdminLinkItem[];
    return Array.isArray(parsed) ? parsed.filter((item) => item.label && item.href) : [];
  } catch {
    return [];
  }
}
