import type { AdminBrandLink, AdminContent, AdminSocialLink } from "@/lib/admin-demo-data";

export const socialPlatforms = [
  "WhatsApp",
  "Call",
  "Facebook",
  "Instagram",
  "X",
  "LinkedIn",
  "YouTube",
  "TikTok",
  "Telegram",
  "Pinterest",
  "Email"
] as const;

export type SocialPlatform = (typeof socialPlatforms)[number];

export function parseSocialLinks(content: AdminContent): AdminSocialLink[] {
  try {
    const parsed = JSON.parse(content.settings.socialLinks || "[]") as AdminSocialLink[];
    if (Array.isArray(parsed) && parsed.length) {
      return parsed.filter((link) => link.platform && link.href);
    }
  } catch {
    // Fall back to legacy fixed fields below.
  }

  return [
    { id: "whatsapp", platform: "WhatsApp", href: content.settings.whatsapp },
    { id: "call", platform: "Call", href: `tel:${content.settings.phone.replace(/\s+/g, "")}` },
    { id: "facebook", platform: "Facebook", href: content.settings.facebook }
  ].filter((link) => link.href);
}

function parseIds(value?: string) {
  return (value ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

export function selectedSocialLinks(content: AdminContent, key: "footerSocialIds" | "quickContactSocialIds") {
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
