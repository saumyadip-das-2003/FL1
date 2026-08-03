import type { AdminSocialLink } from "@/lib/admin-demo-data";
import { groupedSocialLinks } from "@/lib/social-platforms";
import { SocialLinkButton } from "@/components/social-links";

export function ContactSocialSections({ links }: { links: AdminSocialLink[] }) {
  const groups = groupedSocialLinks(links);

  if (!groups.length) {
    return null;
  }

  return (
    <div className="mt-6 grid gap-6">
      {groups.map((group) => (
        <section key={group.title}>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">{group.title}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {group.links.map((link) => (
              <SocialLinkButton key={link.id} link={link} showLabel />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
