import { AboutTeaser } from "@/components/about-teaser";
import { FeaturedNews } from "@/components/featured-news";
import { FeaturedPeople } from "@/components/featured-people";
import { FeaturedProjects } from "@/components/featured-projects";
import { FeaturedServices } from "@/components/featured-services";
import { Hero } from "@/components/hero";
import { HomeIntro } from "@/components/home-intro";
import { getLiveContent } from "@/lib/live-content";

export default async function Home() {
  const content = await getLiveContent();
  const stats = [
    { value: content.settings.statYears, label: "Years active" },
    { value: content.settings.statProjects, label: "Projects completed" },
    { value: content.settings.statCountries, label: "Countries worked in" }
  ];

  return (
    <HomeIntro
      companyName={content.settings.companyName}
      tagline={content.settings.tagline}
      logoUrl={content.settings.logoUrl}
      homeLogoText={content.settings.homeLogoText}
    >
      <main>
        <Hero
          headline={content.settings.homeHeadline}
          tagline={content.settings.homeTagline}
          mediaType={content.settings.homeMediaType}
          videoUrl={content.settings.homeVideoUrl}
          imageUrl={content.settings.homeImageUrl}
        />
        <FeaturedProjects />
        <FeaturedServices />
        <FeaturedNews />
        <FeaturedPeople />
        <AboutTeaser profile={content.settings.aboutStudioProfile} stats={stats} />
      </main>
    </HomeIntro>
  );
}
