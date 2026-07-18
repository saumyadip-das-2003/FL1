import { AboutTeaser } from "@/components/about-teaser";
import { FeaturedNews } from "@/components/featured-news";
import { FeaturedProjects } from "@/components/featured-projects";
import { FeaturedServices } from "@/components/featured-services";
import { Hero } from "@/components/hero";
import { HomeIntro } from "@/components/home-intro";
import { HomeSocialDock } from "@/components/home-social-dock";

export default function Home() {
  return (
    <HomeIntro>
      <main>
        <Hero />
        <FeaturedProjects />
        <FeaturedServices />
        <FeaturedNews />
        <AboutTeaser />
      </main>
      <HomeSocialDock />
    </HomeIntro>
  );
}
