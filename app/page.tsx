import { AboutTeaser } from "@/components/about-teaser";
import { FeaturedProjects } from "@/components/featured-projects";
import { Hero } from "@/components/hero";
import { HomeIntro } from "@/components/home-intro";

export default function Home() {
  return (
    <HomeIntro>
      <main>
        <Hero />
        <FeaturedProjects />
        <AboutTeaser />
      </main>
    </HomeIntro>
  );
}
