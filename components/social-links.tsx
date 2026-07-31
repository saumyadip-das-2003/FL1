import Link from "next/link";

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

const defaultLinks = [
  { label: "WhatsApp", href: "https://wa.me/8801700000000", icon: WhatsAppLogo, color: "bg-[#25D366]" },
  { label: "Call", href: "tel:+8801700000000", icon: PhoneLogo, color: "bg-[#0A84FF]" },
  { label: "Facebook", href: "https://facebook.com", icon: FacebookLogo, color: "bg-[#1877F2]" }
];

export function SocialLinks({
  compact = false,
  links = defaultLinks
}: {
  compact?: boolean;
  links?: { label: string; href: string; icon?: typeof WhatsAppLogo; color?: string }[];
}) {
  return (
    <div className={compact ? "flex flex-wrap gap-2" : "flex flex-col gap-2"}>
      {links.map((link) => {
        const Icon = link.icon ?? defaultLinks.find((item) => item.label === link.label)?.icon ?? PhoneLogo;
        const color = link.color ?? defaultLinks.find((item) => item.label === link.label)?.color ?? "bg-ink";

        return (
          <Link
            key={link.label}
            href={link.href}
            aria-label={link.label}
            target={link.href.startsWith("tel:") ? undefined : "_blank"}
            rel={link.href.startsWith("tel:") ? undefined : "noreferrer"}
            className={`flex h-11 w-11 items-center justify-center border border-white/30 ${color} shadow-sm transition hover:scale-105`}
          >
            <Icon />
          </Link>
        );
      })}
    </div>
  );
}
