import { SocialLinks } from "@/components/social-links";

export function HomeSocialDock() {
  return (
    <div className="fixed bottom-5 right-5 z-40 hidden md:block">
      <SocialLinks />
    </div>
  );
}
