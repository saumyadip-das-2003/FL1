import Link from "next/link";
import type { AdminSocialLink } from "@/lib/admin-demo-data";
import { normalizeSocialPlatform } from "@/lib/social-platforms";

function WhatsAppLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-white">
      <path d="M12.04 2.05A9.83 9.83 0 0 0 2.2 11.86c0 1.73.45 3.4 1.3 4.88L2.1 21.9l5.28-1.38a9.8 9.8 0 0 0 4.66 1.18h.01a9.83 9.83 0 0 0-.01-19.65Zm5.8 14.05c-.25.7-1.43 1.35-2 1.44-.53.08-1.2.12-1.93-.12-.45-.14-1.02-.33-1.75-.65-3.08-1.33-5.1-4.43-5.25-4.64-.15-.2-1.25-1.66-1.25-3.17 0-1.5.79-2.25 1.07-2.56.28-.3.62-.38.82-.38h.6c.2 0 .47-.07.73.56.25.6.86 2.1.94 2.25.08.15.13.33.03.53-.1.2-.15.33-.3.5-.15.18-.32.4-.45.54-.15.15-.3.31-.13.61.18.3.78 1.29 1.68 2.09 1.16 1.03 2.13 1.35 2.43 1.5.3.15.48.13.66-.08.17-.2.75-.88.95-1.18.2-.3.4-.25.68-.15.28.1 1.78.84 2.08.99.3.15.5.23.58.36.08.13.08.75-.17 1.45Z" />
    </svg>
  );
}

function PhoneLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-white">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2Z" />
    </svg>
  );
}

function FacebookLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-white">
      <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.52 1.5-3.92 3.78-3.92 1.1 0 2.24.2 2.24.2v2.47H15.2c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22C18.34 21.24 22 17.08 22 12.06Z" />
    </svg>
  );
}

function InstagramLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-white">
      <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm8.7 2.3a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
    </svg>
  );
}

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-white">
      <path d="M18.9 2h3.1l-6.8 7.8L23.2 22h-6.3l-4.9-7.4L6.4 22H3.2l7.3-8.4L2.8 2h6.4l4.4 6.7L18.9 2Zm-1.1 17.9h1.7L8.2 4H6.4l11.4 15.9Z" />
    </svg>
  );
}

function LinkedInLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-white">
      <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3 9.75h4V21H3V9.75Zm6.25 0h3.84v1.54h.05c.54-.96 1.86-1.98 3.83-1.98 4.1 0 4.86 2.7 4.86 6.21V21h-4v-4.86c0-1.16-.02-2.65-1.62-2.65-1.62 0-1.87 1.27-1.87 2.57V21h-4V9.75Z" />
    </svg>
  );
}

function YouTubeLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-white">
      <path d="M21.6 7.2s-.2-1.5-.8-2.1c-.8-.8-1.6-.8-2-.9C16 4 12 4 12 4s-4 0-6.8.2c-.4.1-1.2.1-2 .9-.6.6-.8 2.1-.8 2.1S2 9 2 10.9v1.8c0 1.9.4 3.7.4 3.7s.2 1.5.8 2.1c.8.8 1.9.8 2.4.9 1.7.2 6.4.2 6.4.2s4 0 6.8-.2c.4-.1 1.2-.1 2-.9.6-.6.8-2.1.8-2.1s.4-1.8.4-3.7v-1.8c0-1.9-.4-3.7-.4-3.7ZM10 15.4V8.9l5.8 3.3L10 15.4Z" />
    </svg>
  );
}

function TikTokLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-white">
      <path d="M16.6 2c.3 2.7 1.8 4.3 4.4 4.5v3.4a8 8 0 0 1-4.4-1.4v6.3c0 4-2.7 6.7-6.6 6.7a6.4 6.4 0 0 1-6.5-6.3c0-3.7 2.9-6.4 6.7-6.4.5 0 .9 0 1.3.1v3.6c-.4-.1-.8-.2-1.3-.2-1.8 0-3.1 1.2-3.1 2.8 0 1.7 1.2 2.8 2.9 2.8 1.8 0 2.9-1.1 2.9-3.2V2h3.7Z" />
    </svg>
  );
}

function TelegramLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-white">
      <path d="M21.7 4.2 18.4 20c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.3L5.8 13.4.9 11.9c-1.1-.3-1.1-1.1.2-1.6L20.3 3c.9-.3 1.7.2 1.4 1.2Z" />
    </svg>
  );
}

function PinterestLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-white">
      <path d="M12.1 2C6.6 2 3 5.6 3 10.2c0 2.1 1.1 4.7 2.8 5.5.3.1.5.1.6-.2.1-.2.4-1.4.5-1.7.1-.3 0-.4-.2-.7-.6-.7-1-1.7-1-2.8 0-3.2 2.4-6.2 6.4-6.2 3.5 0 5.4 2.1 5.4 5 0 3.7-1.6 6.2-3.8 6.2-1.2 0-2.1-1-1.8-2.2.3-1.5 1-3.1 1-4.2 0-1-.5-1.8-1.6-1.8-1.3 0-2.3 1.3-2.3 3.1 0 1.1.4 1.9.4 1.9l-1.5 6.2c-.4 1.7-.2 3.7-.1 3.9.1.1.2.1.3 0 .1-.2 1.8-2.3 2.4-4.1.2-.5.9-3.4.9-3.4.5.8 1.7 1.5 3 1.5 3.9 0 6.6-3.6 6.6-8.3C21 5.1 18.1 2 12.1 2Z" />
    </svg>
  );
}

function EmailLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-white">
      <path d="M3.5 5h17c.8 0 1.5.7 1.5 1.5v11c0 .8-.7 1.5-1.5 1.5h-17c-.8 0-1.5-.7-1.5-1.5v-11C2 5.7 2.7 5 3.5 5Zm8.5 8 8-5.4V7l-8 5.2L4 7v.6L12 13Zm0 2.2L4 10v7h16v-7l-8 5.2Z" />
    </svg>
  );
}

function GenericLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-white">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm3.9 6.1h-2a11.8 11.8 0 0 0-.8-2.6 8.1 8.1 0 0 1 2.8 2.6ZM12 4.1c.4.6.9 1.9 1.2 4h-2.4c.3-2.1.8-3.4 1.2-4ZM4.3 14a8.6 8.6 0 0 1 0-4h3.4a16.7 16.7 0 0 0 0 4H4.3Zm.8 1.9h3.1c.2 1 .5 1.9.8 2.6a8.1 8.1 0 0 1-3.9-2.6Zm3.1-7.8H5.1A8.1 8.1 0 0 1 9 5.5c-.3.7-.6 1.6-.8 2.6ZM12 19.9c-.4-.6-.9-1.9-1.2-4h2.4c-.3 2.1-.8 3.4-1.2 4Zm1.6-5.9h-3.2a14.7 14.7 0 0 1 0-4h3.2a14.7 14.7 0 0 1 0 4Zm1.4 4.5c.3-.7.6-1.6.8-2.6h3.1a8.1 8.1 0 0 1-3.9 2.6Zm1.3-4.5a16.7 16.7 0 0 0 0-4h3.4a8.6 8.6 0 0 1 0 4h-3.4Z" />
    </svg>
  );
}

function SimpleIconLogo({ slug }: { slug: string }) {
  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}/white`}
      alt=""
      aria-hidden="true"
      className="h-5 w-5 object-contain"
      loading="lazy"
    />
  );
}

const platformMap = {
  "WhatsApp Business": { icon: WhatsAppLogo, color: "bg-[#25D366]" },
  WhatsApp: { icon: WhatsAppLogo, color: "bg-[#25D366]" },
  Call: { icon: PhoneLogo, color: "bg-[#0A84FF]" },
  "Facebook Page": { icon: FacebookLogo, color: "bg-[#1877F2]" },
  "Facebook Group": { icon: FacebookLogo, color: "bg-[#1877F2]" },
  "Facebook Messenger": { icon: () => <SimpleIconLogo slug="messenger" />, color: "bg-[#0084FF]" },
  Facebook: { icon: FacebookLogo, color: "bg-[#1877F2]" },
  Instagram: { icon: InstagramLogo, color: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]" },
  "X (Twitter)": { icon: XLogo, color: "bg-black" },
  X: { icon: XLogo, color: "bg-black" },
  LinkedIn: { icon: LinkedInLogo, color: "bg-[#0A66C2]" },
  YouTube: { icon: YouTubeLogo, color: "bg-[#FF0000]" },
  TikTok: { icon: TikTokLogo, color: "bg-black" },
  Threads: { icon: () => <SimpleIconLogo slug="threads" />, color: "bg-black" },
  Reddit: { icon: () => <SimpleIconLogo slug="reddit" />, color: "bg-[#FF4500]" },
  "Telegram Channel": { icon: TelegramLogo, color: "bg-[#26A5E4]" },
  Telegram: { icon: TelegramLogo, color: "bg-[#26A5E4]" },
  Discord: { icon: () => <SimpleIconLogo slug="discord" />, color: "bg-[#5865F2]" },
  Bluesky: { icon: () => <SimpleIconLogo slug="bluesky" />, color: "bg-[#1185FE]" },
  Mastodon: { icon: () => <SimpleIconLogo slug="mastodon" />, color: "bg-[#6364FF]" },
  Quora: { icon: () => <SimpleIconLogo slug="quora" />, color: "bg-[#B92B27]" },
  Pinterest: { icon: PinterestLogo, color: "bg-[#E60023]" },
  "Professional Email": { icon: EmailLogo, color: "bg-[#555555]" },
  Email: { icon: EmailLogo, color: "bg-[#555555]" },
  Behance: { icon: () => <SimpleIconLogo slug="behance" />, color: "bg-[#1769FF]" },
  Houzz: { icon: () => <SimpleIconLogo slug="houzz" />, color: "bg-[#4DBC15]" },
  ArchDaily: { icon: () => <SimpleIconLogo slug="archdaily" />, color: "bg-[#111111]" },
  Designboom: { icon: () => <SimpleIconLogo slug="designboom" />, color: "bg-[#111111]" },
  Dezeen: { icon: () => <SimpleIconLogo slug="dezeen" />, color: "bg-[#111111]" },
  Archinect: { icon: () => <SimpleIconLogo slug="archinect" />, color: "bg-[#333333]" },
  Dribbble: { icon: () => <SimpleIconLogo slug="dribbble" />, color: "bg-[#EA4C89]" },
  Vimeo: { icon: () => <SimpleIconLogo slug="vimeo" />, color: "bg-[#1AB7EA]" },
  Flickr: { icon: () => <SimpleIconLogo slug="flickr" />, color: "bg-[#0063DC]" },
  Medium: { icon: () => <SimpleIconLogo slug="medium" />, color: "bg-black" },
  Fiverr: { icon: () => <SimpleIconLogo slug="fiverr" />, color: "bg-[#1DBF73]" },
  Upwork: { icon: () => <SimpleIconLogo slug="upwork" />, color: "bg-[#14A800]" },
  "Freelancer.com": { icon: () => <SimpleIconLogo slug="freelancer" />, color: "bg-[#29B2FE]" },
  PeoplePerHour: { icon: () => <SimpleIconLogo slug="peopleperhour" />, color: "bg-[#FF7300]" },
  Guru: { icon: () => <SimpleIconLogo slug="guru" />, color: "bg-[#00B981]" },
  Contra: { icon: () => <SimpleIconLogo slug="contra" />, color: "bg-black" },
  Toptal: { icon: () => <SimpleIconLogo slug="toptal" />, color: "bg-[#3863A0]" },
  Wellfound: { icon: () => <SimpleIconLogo slug="wellfound" />, color: "bg-[#111111]" }
};

const defaultLinks = [
  { platform: "WhatsApp", href: "https://wa.me/8801700000000" },
  { platform: "Call", href: "tel:+8801700000000" },
  { platform: "Facebook", href: "https://facebook.com" }
];

function normalizeHref(link: Pick<AdminSocialLink, "platform" | "href">) {
  const platform = normalizeSocialPlatform(link.platform);
  if (link.platform === "Call" && !link.href.startsWith("tel:")) {
    return `tel:${link.href.replace(/\s+/g, "")}`;
  }

  if (platform === "Professional Email" && !link.href.startsWith("mailto:")) {
    return `mailto:${link.href}`;
  }

  return link.href;
}

export function SocialLinks({
  compact = false,
  links = defaultLinks
}: {
  compact?: boolean;
  links?: Pick<AdminSocialLink, "platform" | "href">[];
}) {
  return (
    <div className={compact ? "flex flex-wrap gap-2" : "flex flex-col gap-2"}>
      {links.map((link) => (
        <SocialLinkButton key={`${normalizeSocialPlatform(link.platform)}-${link.href}`} link={link} />
      ))}
    </div>
  );
}

export function SocialLinkButton({
  link,
  showLabel = false
}: {
  link: Pick<AdminSocialLink, "platform" | "href">;
  showLabel?: boolean;
}) {
  const platformLabel = normalizeSocialPlatform(link.platform);
  const platform = platformMap[platformLabel as keyof typeof platformMap] ?? { icon: GenericLogo, color: "bg-ink" };
  const href = normalizeHref(link);
  const Icon = platform.icon;

  return (
    <Link
      href={href}
      aria-label={platformLabel}
      title={platformLabel}
      target={href.startsWith("tel:") || href.startsWith("mailto:") ? undefined : "_blank"}
      rel={href.startsWith("tel:") || href.startsWith("mailto:") ? undefined : "noreferrer"}
      className={
        showLabel
          ? "group flex items-center gap-3 border border-black/10 bg-white p-3 text-sm transition hover:border-black/30 hover:bg-neutral-50 dark:border-white/10 dark:bg-[#4a4a4a] dark:hover:border-white/30 dark:hover:bg-[#555555]"
          : `group relative flex h-11 w-11 items-center justify-center border border-white/30 ${platform.color} shadow-sm transition hover:scale-105`
      }
    >
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center ${platform.color}`}>
        <Icon />
      </span>
      {showLabel ? (
        <span className="min-w-0">
          <span className="block font-medium">{platformLabel}</span>
          <span className="block truncate text-xs text-muted">{href.replace(/^mailto:|^tel:/, "")}</span>
        </span>
      ) : (
        <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap bg-ink px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-paper opacity-0 shadow-sm transition group-hover:translate-y-0 group-hover:opacity-100 dark:bg-paper dark:text-ink">
          {platformLabel}
        </span>
      )}
    </Link>
  );
}
