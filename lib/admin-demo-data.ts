import { projects, team } from "@/lib/data";
import { newsItems } from "@/lib/news";

export type AdminMedia = {
  id: string;
  type: "image" | "video";
  source: string;
  caption: string;
};

export type AdminProject = {
  id: string;
  title: string;
  location: string;
  year: string;
  section: string;
  subsection: string;
  image: string;
  media: AdminMedia[];
  description: string;
};

export type AdminService = {
  id: string;
  title: string;
  image: string;
  description: string;
  tags: string;
};

export type AdminNews = {
  id: string;
  title: string;
  date: string;
  category: string;
  image: string;
  gallery: string;
  description: string;
};

export type AdminPerson = {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
};

export type AdminContent = {
  settings: {
    companyName: string;
    tagline: string;
    logoUrl: string;
    homeHeadline: string;
    homeTagline: string;
    featuredProjectIds: string;
    featuredServiceIds: string;
    featuredNewsIds: string;
    statYears: string;
    statProjects: string;
    statCountries: string;
    aboutStudioProfile: string;
    aboutMission: string;
    aboutVision: string;
    founderMessage: string;
    founderImage: string;
    email: string;
    phone: string;
    address: string;
    offices: string;
    whatsapp: string;
    facebook: string;
    instagram: string;
    x: string;
    linkedin: string;
  };
  projects: AdminProject[];
  services: AdminService[];
  news: AdminNews[];
  people: AdminPerson[];
};

export const adminStorageKey = "modern-age-studio-admin-demo";

export const demoServices: AdminService[] = [
  {
    id: "architecture-design-drafting",
    title: "Architecture Design & Drafting",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80",
    description: "Professional architectural drawings and documentation for concept, planning, and presentation stages.",
    tags: "AutoCAD, Revit, Planning"
  },
  {
    id: "3d-modeling",
    title: "3D Modeling",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1400&q=80",
    description: "Accurate architectural models for design development, visualization, and coordination workflows.",
    tags: "3ds Max, SketchUp, Rhino, Revit"
  },
  {
    id: "rendering-visualization",
    title: "Rendering & Visualization",
    image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1400&q=80",
    description: "High-quality still renders that communicate materiality, lighting, and spatial experience.",
    tags: "Lumion, V-Ray, Enscape, D5 Render"
  }
];

export function createSeedAdminContent(): AdminContent {
  return {
    settings: {
      companyName: "Atelier Northline",
      tagline: "Architecture Studio",
      logoUrl: "",
      homeHeadline: "Formal spaces for a changing climate.",
      homeTagline: "A client-facing studio prototype for architecture, interiors, exteriors, and landscape portfolios.",
      featuredProjectIds: projects.slice(0, 3).map((project) => project.slug).join(", "),
      featuredServiceIds: demoServices.map((service) => service.id).join(", "),
      featuredNewsIds: newsItems.slice(0, 2).map((item) => item.slug).join(", "),
      statYears: "14",
      statProjects: "86",
      statCountries: "11",
      aboutStudioProfile:
        "Atelier Northline is a multidisciplinary office working across civic architecture, private residences, hospitality interiors, exterior envelopes, and climate-responsive landscapes.",
      aboutMission: "We pursue architecture that is formally clear, materially precise, and generous to daily life.",
      aboutVision: "To shape calm, durable places that help cities adapt with intelligence and grace.",
      founderMessage:
        "Architecture should make complexity feel quietly resolved. This founder message can introduce the real practice, its origins, collaborators, and values.",
      founderImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
      email: "studio@ateliernorthline.test",
      phone: "+880 1700 000 000",
      address: "House 18, Road 7, Gulshan, Dhaka",
      offices: "Dhaka / House 18, Road 7, Gulshan\nSingapore / 22 Keong Saik Road\nDubai / Design District, Building 5",
      whatsapp: "https://wa.me/8801700000000",
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      x: "https://x.com",
      linkedin: "https://linkedin.com"
    },
    projects: projects.map((project) => ({
      id: project.slug,
      title: project.title,
      location: project.location,
      year: project.year,
      section: project.section ?? project.category,
      subsection: project.subsection ?? "",
      image: project.image,
      media: [
        {
          id: `${project.slug}-cover`,
          type: "image",
          source: project.image,
          caption: `${project.title} primary view in context.`
        },
        ...project.gallery.map((image, index) => ({
          id: `${project.slug}-image-${index + 1}`,
          type: "image" as const,
          source: image,
          caption: `${project.title} gallery image ${index + 1}.`
        })),
        {
          id: `${project.slug}-video-1`,
          type: "video",
          source: project.video ?? "https://youtu.be/OP_fVIUTr9Y",
          caption: `${project.title} placeholder project film.`
        }
      ],
      description: project.description
    })),
    services: demoServices,
    news: newsItems.map((item) => ({
      id: item.slug,
      title: item.title,
      date: item.date,
      category: item.category,
      image: item.image,
      gallery: item.gallery.join("\n"),
      description: [item.excerpt, ...item.body].join("\n\n")
    })),
    people: team.map((person) => ({
      id: person.name.toLowerCase().replace(/\s+/g, "-"),
      name: person.name,
      role: person.role,
      image: person.image,
      bio: person.bio
    }))
  };
}
