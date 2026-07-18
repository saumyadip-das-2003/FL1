import { SocialLinks } from "@/components/social-links";

export function HomeSocialDock() {
  return (
    <div className="fixed bottom-4 right-4 z-40 scale-90 origin-bottom-right md:bottom-5 md:right-5 md:scale-100">
      <SocialLinks />
    </div>
  );
}
