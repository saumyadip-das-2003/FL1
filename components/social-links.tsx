import { Facebook, Instagram, Linkedin, MessageCircle } from "lucide-react";
import Link from "next/link";

const links = [
  { label: "WhatsApp", href: "https://wa.me/8801700000000", icon: MessageCircle },
  { label: "Facebook", href: "https://facebook.com", icon: Facebook },
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
  { label: "X", href: "https://x.com", text: "X" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin }
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
            target="_blank"
            rel="noreferrer"
            className="flex h-10 w-10 items-center justify-center border border-black/15 bg-white text-ink transition hover:bg-ink hover:text-paper dark:border-white/15 dark:bg-[#4a4a4a] dark:text-paper dark:hover:bg-paper dark:hover:text-ink"
          >
            {Icon ? <Icon size={17} /> : <span className="text-sm font-medium">{link.text}</span>}
          </Link>
        );
      })}
    </div>
  );
}
