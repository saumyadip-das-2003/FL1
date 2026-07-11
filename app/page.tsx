import { AboutTeaser } from "@/components/about-teaser";
import { FeaturedProjects } from "@/components/featured-projects";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedProjects />
      <AboutTeaser />
    </main>
  );
}
