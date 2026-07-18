import { projects, team } from "@/lib/data";
import { newsItems } from "@/lib/news";

export type AdminProject = {
  id: string;
  title: string;
  location: string;
  year: string;
  section: string;
  subsection: string;
  image: string;
  gallery: string;
  video: string;
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
    email: string;
    phone: string;
    address: string;
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
      email: "studio@ateliernorthline.test",
      phone: "+880 1700 000 000",
      address: "House 18, Road 7, Gulshan, Dhaka",
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
      gallery: project.gallery.join("\n"),
      video: project.video ?? "https://youtu.be/OP_fVIUTr9Y",
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
