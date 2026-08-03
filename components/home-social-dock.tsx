import { SocialLinks } from "@/components/social-links";

export function HomeSocialDock({
  links
}: {
  links?: Parameters<typeof SocialLinks>[0]["links"];
}) {
  return (
    <div
      data-site-chrome
      className="fixed bottom-4 right-4 z-40 max-h-[calc(100vh-8rem)] scale-90 origin-bottom-right overflow-y-auto overflow-x-visible pr-1 md:bottom-5 md:right-5 md:scale-100"
    >
      <SocialLinks links={links} />
    </div>
  );
}
