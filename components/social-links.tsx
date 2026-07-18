import { Facebook, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

const links = [
  { label: "WhatsApp", href: "https://wa.me/8801700000000", icon: MessageCircle },
  { label: "Call", href: "tel:+8801700000000", icon: Phone },
  { label: "Facebook", href: "https://facebook.com", icon: Facebook }
];

export function SocialLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "flex flex-wrap gap-2" : "flex flex-col gap-2"}>
      {links.map((link) => {
        const Icon = link.icon;

        return (
          <Link
            key={link.label}
            href={link.href}
            aria-label={link.label}
            target={link.href.startsWith("tel:") ? undefined : "_blank"}
            rel={link.href.startsWith("tel:") ? undefined : "noreferrer"}
            className="flex h-10 w-10 items-center justify-center border border-black/15 bg-white text-ink transition hover:bg-ink hover:text-paper dark:border-white/15 dark:bg-[#4a4a4a] dark:text-paper dark:hover:bg-paper dark:hover:text-ink"
          >
            <Icon size={17} />
          </Link>
        );
      })}
    </div>
  );
}
