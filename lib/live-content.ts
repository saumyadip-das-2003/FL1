import { createSeedAdminContent, type AdminContent, type AdminNews, type AdminPerson, type AdminProject, type AdminService } from "@/lib/admin-demo-data";
import { getSanityContent } from "@/lib/sanity-http";
import type { Project, ProjectCategory, ProjectSection } from "@/lib/data";
import type { NewsItem } from "@/lib/news";

export async function getLiveContent(): Promise<AdminContent> {
  try {
    return await getSanityContent();
  } catch {
    return createSeedAdminContent();
  }
}

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
  const imageMedia = project.media.filter((media) => media.type === "image");
  const firstVideo = project.media.find((media) => media.type === "video");

  return {
    slug: project.id,
    title: project.title,
    location: project.location,
    year: project.year,
    category: categoryFromSection(project.section),
    section: project.section as ProjectSection,
    subsection: project.subsection,
    image: project.image,
    gallery: imageMedia.map((media) => media.source).filter((source) => source !== project.image),
    media: project.media.map((media) => ({
      type: media.type,
      source: media.source,
      caption: media.caption
    })),
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
    role: person.role,
    image: person.image,
    bio: person.bio,
    studio: person.studio,
    office: person.office,
    profile: person.profile
  };
}
