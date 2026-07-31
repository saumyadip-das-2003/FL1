import { AboutTeaser } from "@/components/about-teaser";
import { FeaturedNews } from "@/components/featured-news";
import { FeaturedProjects } from "@/components/featured-projects";
import { FeaturedServices } from "@/components/featured-services";
import { Hero } from "@/components/hero";
import { HomeIntro } from "@/components/home-intro";
import { HomeSocialDock } from "@/components/home-social-dock";
import { getLiveContent } from "@/lib/live-content";
import { Facebook, MessageCircle, Phone } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getLiveContent();
  const stats = [
    { value: content.settings.statYears, label: "Years active" },
    { value: content.settings.statProjects, label: "Projects completed" },
    { value: content.settings.statCountries, label: "Countries worked in" }
  ];
  const socialLinks = [
    { label: "WhatsApp", href: content.settings.whatsapp, icon: MessageCircle },
    { label: "Call", href: `tel:${content.settings.phone.replace(/\s+/g, "")}`, icon: Phone },
    { label: "Facebook", href: content.settings.facebook, icon: Facebook }
  ];

  return (
    <HomeIntro>
      <main>
        <Hero headline={content.settings.homeHeadline} tagline={content.settings.homeTagline} />
        <FeaturedProjects />
        <FeaturedServices />
        <FeaturedNews />
        <AboutTeaser profile={content.settings.aboutStudioProfile} stats={stats} />
      </main>
      <HomeSocialDock links={socialLinks} />
    </HomeIntro>
  );
}
