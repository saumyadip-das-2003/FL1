import { projectTaxonomy, projects, serializeProjectTaxonomy, team } from "@/lib/data";
import { newsItems } from "@/lib/news";

export type AdminMedia = {
  id: string;
  type: "image" | "video" | "caption";
  source: string;
  caption: string;
};

export type AdminProject = {
  id: string;
  title: string;
  location: string;
  year: string;
  client: string;
  status: string;
  section: string;
  subsection: string;
  image: string;
  media: AdminMedia[];
  mapLocation: string;
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
  category: string;
  role: string;
  image: string;
  bio: string;
  studio: string;
  office: string;
  profile: string;
};

export type AdminAboutMessage = {
  id: string;
  name: string;
  role: string;
  image: string;
  message: string;
};

export type AdminSocialLink = {
  id: string;
  platform: string;
  href: string;
};

export type AdminBrandLink = {
  id: string;
  name: string;
  logo: string;
  href: string;
};

export type AdminTextItem = {
  id: string;
  title: string;
  body: string;
};

export type AdminLinkItem = {
  id: string;
  label: string;
  href: string;
};

export type AdminContent = {
  settings: {
    companyName: string;
    tagline: string;
    logoUrl: string;
    homeLogoText: string;
    homeMediaType: string;
    homeVideoUrl: string;
    homeImageUrl: string;
    homeHeadline: string;
    homeTagline: string;
    featuredProjectIds: string;
    featuredServiceIds: string;
    featuredNewsIds: string;
    servicesIntroTitle: string;
    servicesIntroBody: string;
    serviceShowWorkflow: string;
    serviceShowWhyChoose: string;
    serviceShowFreelance: string;
    serviceShowLocalSupport: string;
    serviceShowSocialPresence: string;
    serviceShowTeamCulture: string;
    serviceShowCta: string;
    serviceWorkflow: string;
    serviceWhyChoose: string;
    serviceFreelanceTitle: string;
    serviceFreelanceBody: string;
    serviceFreelanceLinks: string;
    serviceLocalSupportTitle: string;
    serviceLocalSupportBody: string;
    serviceSocialPresenceTitle: string;
    serviceSocialPresenceBody: string;
    serviceSocialPresenceSocialIds: string;
    serviceTeamCultureTitle: string;
    serviceTeamCultureBody: string;
    serviceCtaTitle: string;
    serviceCtaPrimaryLabel: string;
    serviceCtaSecondaryLabel: string;
    statYears: string;
    statProjects: string;
    statCountries: string;
    aboutStudioTitle: string;
    aboutStudioProfile: string;
    aboutMissionTitle: string;
    aboutMission: string;
    aboutVisionTitle: string;
    aboutVision: string;
    aboutHeroImage: string;
    founderMessage: string;
    founderImage: string;
    aboutMessages: string;
    email: string;
    phone: string;
    address: string;
    offices: string;
    officeMaps: string;
    whatsapp: string;
    facebook: string;
    instagram: string;
    x: string;
    linkedin: string;
    socialLinks: string;
    footerSocialIds: string;
    quickContactSocialIds: string;
    brandLinks: string;
    projectSubsections: string;
    peopleRoles: string;
    newsCategories: string;
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
      homeLogoText: "Modern Age Studio",
      homeMediaType: "none",
      homeVideoUrl: "",
      homeImageUrl: "",
      homeHeadline: "Formal spaces for a changing climate.",
      homeTagline: "A client-facing studio prototype for architecture, interiors, exteriors, and landscape portfolios.",
      featuredProjectIds: projects.slice(0, 3).map((project) => project.slug).join(", "),
      featuredServiceIds: demoServices.map((service) => service.id).join(", "),
      featuredNewsIds: newsItems.slice(0, 2).map((item) => item.slug).join(", "),
      servicesIntroTitle: "Our expertise",
      servicesIntroBody:
        "From concept drafting to cinematic walkthroughs, we deliver architecture-focused design and visualization services for local and international projects.",
      serviceShowWorkflow: "true",
      serviceShowWhyChoose: "true",
      serviceShowFreelance: "true",
      serviceShowLocalSupport: "true",
      serviceShowSocialPresence: "true",
      serviceShowTeamCulture: "true",
      serviceShowCta: "true",
      serviceWorkflow: JSON.stringify([
        { id: "workflow-1", title: "Consultation", body: "Understanding goals, scope, and project context." },
        { id: "workflow-2", title: "Requirement Analysis", body: "Reviewing briefs, references, and deliverables." },
        { id: "workflow-3", title: "Concept Development", body: "Exploring design direction and visual language." },
        { id: "workflow-4", title: "Design Production", body: "Creating drawings, models, renders, and assets." },
        { id: "workflow-5", title: "Review & Revision", body: "Collaborative feedback and refinement cycles." },
        { id: "workflow-6", title: "Final Delivery", body: "Exporting polished files ready for presentation." }
      ]),
      serviceWhyChoose: JSON.stringify([
        { id: "why-1", title: "Client Satisfaction Focus", body: "Every deliverable is shaped around clear communication and client goals." },
        { id: "why-2", title: "Detail-Oriented Workflow", body: "Precision in drawings, materials, lighting, and presentation quality." },
        { id: "why-3", title: "Fast Communication", body: "Responsive updates and collaborative review throughout each project." },
        { id: "why-4", title: "Global Freelance Experience", body: "Professional delivery for international clients across major platforms." },
        { id: "why-5", title: "Local Project Support", body: "Bangladesh-based coordination for site analysis and execution support." },
        { id: "why-6", title: "Dedicated Team", body: "Specialists across drafting, modeling, rendering, and animation." },
        { id: "why-7", title: "Professional Quality Standards", body: "Studio-grade outputs suitable for client, competition, and marketing use." }
      ]),
      serviceFreelanceTitle: "Global freelance services",
      serviceFreelanceBody:
        "We deliver architecture and visualization projects professionally to international clients through trusted freelance platforms.",
      serviceFreelanceLinks: JSON.stringify([
        { id: "fiverr", label: "Fiverr", href: "https://www.fiverr.com/" },
        { id: "upwork", label: "Upwork", href: "https://www.upwork.com/" },
        { id: "freelancer", label: "Freelancer", href: "https://www.freelancer.com/" }
      ]),
      serviceLocalSupportTitle: "Local project support",
      serviceLocalSupportBody:
        "Bangladesh-based support network with sector-specific specialists for site analysis, project coordination, and local execution support.",
      serviceSocialPresenceTitle: "Social presence",
      serviceSocialPresenceBody: "The studio actively shares work, updates, and project showcases across social platforms.",
      serviceSocialPresenceSocialIds: "facebook, instagram, linkedin",
      serviceTeamCultureTitle: "Team culture",
      serviceTeamCultureBody:
        "Friendly, humble, and collaborative team culture focused on delivering the best experience for every client.",
      serviceCtaTitle: "Let's Build Something Exceptional Together",
      serviceCtaPrimaryLabel: "Start a Project",
      serviceCtaSecondaryLabel: "Contact Us",
      statYears: "14",
      statProjects: "86",
      statCountries: "11",
      aboutStudioTitle: "Quiet buildings with a strong public life.",
      aboutStudioProfile:
        "Atelier Northline is a multidisciplinary office working across civic architecture, private residences, hospitality interiors, exterior envelopes, and climate-responsive landscapes.",
      aboutMissionTitle: "Architecture that is clear, precise, and generous.",
      aboutMission: "We pursue architecture that is formally clear, materially precise, and generous to daily life.",
      aboutVisionTitle: "Calm, durable places for adaptive cities.",
      aboutVision: "To shape calm, durable places that help cities adapt with intelligence and grace.",
      aboutHeroImage: "",
      founderMessage:
        "Architecture should make complexity feel quietly resolved. This founder message can introduce the real practice, its origins, collaborators, and values.",
      founderImage: "",
      aboutMessages: JSON.stringify([
        {
          id: "founder-message",
          name: "Nadia Rahman",
          role: "Founder & Principal Architect",
          image: "",
          message:
            "Architecture should make complexity feel quietly resolved. This message can introduce the real practice, its origins, collaborators, and values."
        }
      ]),
      email: "studio@ateliernorthline.test",
      phone: "+880 1700 000 000",
      address: "House 18, Road 7, Gulshan, Dhaka",
      offices: "Dhaka / House 18, Road 7, Gulshan\nSingapore / 22 Keong Saik Road\nDubai / Design District, Building 5",
      officeMaps: "https://maps.google.com/maps?q=Gulshan%20Dhaka&t=&z=13&ie=UTF8&iwloc=&output=embed\n\n",
      whatsapp: "https://wa.me/8801700000000",
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      x: "https://x.com",
      linkedin: "https://linkedin.com",
      socialLinks: JSON.stringify([
        { id: "email", platform: "Professional Email", href: "studio@ateliernorthline.test" },
        { id: "whatsapp", platform: "WhatsApp Business", href: "https://wa.me/8801700000000" },
        { id: "call", platform: "Call", href: "tel:+8801700000000" },
        { id: "facebook", platform: "Facebook Page", href: "https://facebook.com" },
        { id: "instagram", platform: "Instagram", href: "https://instagram.com" },
        { id: "linkedin", platform: "LinkedIn", href: "https://linkedin.com" }
      ]),
      footerSocialIds: "whatsapp, call, facebook",
      quickContactSocialIds: "whatsapp, call, facebook",
      brandLinks: JSON.stringify([
        {
          id: "collab-atelier",
          name: "Collaborating Studio",
          logo: "",
          href: "https://example.com"
        }
      ]),
      projectSubsections: serializeProjectTaxonomy(projectTaxonomy),
      peopleRoles: "Architecture, Engineer, Designer, Technical",
      newsCategories: "Studio, Projects, Awards, Research, Press"
    },
    projects: projects.map((project) => ({
      id: project.slug,
      title: project.title,
      location: project.location,
      year: project.year,
      client: project.client ?? "Placeholder Studio",
      status: "Concept",
      section: project.section ?? project.category,
      subsection: project.subsection ?? "",
      image: project.image,
      media: [
        {
          id: `${project.slug}-cover`,
          type: "image",
          source: project.image,
          caption: ""
        },
        {
          id: `${project.slug}-caption-1`,
          type: "caption",
          source: "Project note",
          caption: `${project.title} primary view in context.`
        },
        ...project.gallery.map((image, index) => ({
          id: `${project.slug}-image-${index + 1}`,
          type: "image" as const,
          source: image,
          caption: ""
        })),
        ...(project.video
          ? [
              {
                id: `${project.slug}-video-1`,
                type: "video" as const,
                source: project.video,
                caption: ""
              }
            ]
          : [])
      ],
      mapLocation: project.location,
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
      category: person.role.toLowerCase().includes("technical")
        ? "Technical"
        : person.role.toLowerCase().includes("sustainability")
          ? "Engineer"
          : person.role.toLowerCase().includes("interior") || person.role.toLowerCase().includes("visualization") || person.role.toLowerCase().includes("design")
            ? "Designer"
            : "Architecture",
      role: person.role,
      image: person.image,
      bio: person.bio,
      studio: "Atelier Northline",
      office: "Dhaka / Singapore",
      profile: "Placeholder employee details"
    }))
  };
}
