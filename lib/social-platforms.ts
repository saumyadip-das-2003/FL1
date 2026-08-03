import type { AdminBrandLink, AdminContent, AdminSocialLink } from "@/lib/admin-demo-data";

export const socialPlatformGroups = [
  {
    title: "Brand Foundation",
    platforms: [
      "Professional Email",
      "Facebook Page",
      "Instagram",
      "LinkedIn",
      "YouTube",
      "Pinterest",
      "WhatsApp Business",
      "Facebook Messenger"
    ]
  },
  {
    title: "Social Media & Community",
    platforms: [
      "TikTok",
      "Threads",
      "X (Twitter)",
      "Reddit",
      "Telegram Channel",
      "Discord",
      "Bluesky",
      "Mastodon",
      "Facebook Group",
      "Quora"
    ]
  },
  {
    title: "Architecture Portfolio & Publishing",
    platforms: [
      "Behance",
      "Houzz",
      "ArchDaily",
      "Designboom",
      "Dezeen",
      "Archinect",
      "Dribbble",
      "Vimeo",
      "Flickr",
      "Medium"
    ]
  },
  {
    title: "Freelancing & International Client",
    platforms: [
      "Fiverr",
      "Upwork",
      "Freelancer.com",
      "PeoplePerHour",
      "Guru",
      "Contra",
      "Toptal",
      "Wellfound"
    ]
  }
] as const;

export const legacySocialPlatformMap: Record<string, string> = {
  Email: "Professional Email",
  Facebook: "Facebook Page",
  WhatsApp: "WhatsApp Business",
  X: "X (Twitter)",
  Telegram: "Telegram Channel"
};

export const socialPlatforms = socialPlatformGroups.flatMap((group) => group.platforms);

export type SocialPlatform = (typeof socialPlatforms)[number];

export function normalizeSocialPlatform(platform: string) {
  return legacySocialPlatformMap[platform] ?? platform;
}

export function socialPlatformGroupTitle(platform: string) {
  const normalized = normalizeSocialPlatform(platform);
  return socialPlatformGroups.find((group) => (group.platforms as readonly string[]).includes(normalized))?.title ?? "Other";
}

export function groupedSocialLinks(links: AdminSocialLink[]) {
  return socialPlatformGroups
    .map((group) => ({
      title: group.title,
      links: links.filter((link) => (group.platforms as readonly string[]).includes(normalizeSocialPlatform(link.platform)))
    }))
    .filter((group) => group.links.length > 0);
}

export function parseSocialLinks(content: AdminContent): AdminSocialLink[] {
  try {
    const parsed = JSON.parse(content.settings.socialLinks || "[]") as AdminSocialLink[];
    if (Array.isArray(parsed) && parsed.length) {
      return parsed
        .filter((link) => link.platform && link.href)
        .map((link) => ({ ...link, platform: normalizeSocialPlatform(link.platform) }));
    }
  } catch {
    // Fall back to legacy fixed fields below.
  }

  return [
    { id: "email", platform: "Professional Email", href: content.settings.email },
    { id: "whatsapp", platform: "WhatsApp Business", href: content.settings.whatsapp },
    { id: "facebook", platform: "Facebook Page", href: content.settings.facebook },
    { id: "instagram", platform: "Instagram", href: content.settings.instagram },
    { id: "linkedin", platform: "LinkedIn", href: content.settings.linkedin }
  ].filter((link) => link.href);
}

function parseIds(value?: string) {
  return (value ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

export function selectedSocialLinks(content: AdminContent, key: "footerSocialIds" | "quickContactSocialIds" | "serviceSocialPresenceSocialIds") {
  const links = parseSocialLinks(content);
  const selectedIds = parseIds(content.settings[key]);

  if (!selectedIds.length) {
    return links;
  }

  return selectedIds
    .map((id) => links.find((link) => link.id === id))
    .filter((link): link is AdminSocialLink => Boolean(link));
}

export function parseBrandLinks(content: AdminContent): AdminBrandLink[] {
  try {
    const parsed = JSON.parse(content.settings.brandLinks || "[]") as AdminBrandLink[];
    if (Array.isArray(parsed)) {
      return parsed.filter((brand) => brand.name && brand.logo);
    }
  } catch {
    // Ignore malformed saved brand data.
  }

  return [];
}
