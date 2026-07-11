export type ProjectCategory = "Architecture" | "Interior" | "Exterior" | "Landscape";

export type Project = {
  slug: string;
  title: string;
  location: string;
  year: string;
  category: ProjectCategory;
  image: string;
  gallery: string[];
  excerpt: string;
  description: string;
  video?: string;
};

export const categories: ProjectCategory[] = ["Architecture", "Interior", "Exterior", "Landscape"];

export const projects: Project[] = [
  {
    slug: "meridian-pavilion",
    title: "Meridian Pavilion",
    location: "Dhaka, Bangladesh",
    year: "2026",
    category: "Architecture",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"
    ],
    excerpt: "A civic cultural pavilion shaped by filtered daylight, monsoon gardens, and a porous public ground.",
    description:
      "Meridian Pavilion studies how a public building can remain formal without becoming remote. Layered concrete fins temper the sun, shaded terraces extend civic activity into the landscape, and a calm sequence of galleries creates a deliberate rhythm between compression and release.",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    slug: "northbank-house",
    title: "Northbank House",
    location: "Chittagong, Bangladesh",
    year: "2025",
    category: "Exterior",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1600&q=80"
    ],
    excerpt: "A private residence with deep verandas, restrained materiality, and a facade tuned for coastal air.",
    description:
      "The house is organized as a series of thresholds rather than a single object. Its exterior envelope uses shaded balconies, pale mineral surfaces, and recessed glazing to negotiate privacy, humidity, and long views toward the water."
  },
  {
    slug: "lumen-court",
    title: "Lumen Court",
    location: "Singapore",
    year: "2024",
    category: "Interior",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80"
    ],
    excerpt: "A workplace interior composed around acoustic calm, warm stone, and an illuminated central court.",
    description:
      "Lumen Court reframes the office as a precise social instrument. Shared rooms cluster around a luminous void while focused workspaces sit within a quieter perimeter of timber, wool, and soft reflected light."
  },
  {
    slug: "riverline-terraces",
    title: "Riverline Terraces",
    location: "Sylhet, Bangladesh",
    year: "2025",
    category: "Landscape",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80"
    ],
    excerpt: "Flood-resilient garden terraces that transform seasonal water into a civic landscape experience.",
    description:
      "This landscape proposal treats water as a design material. Planted edges, stepped public rooms, and robust pathways create a flexible riverfront that can host daily leisure while accepting seasonal change."
  },
  {
    slug: "axis-gallery",
    title: "Axis Gallery",
    location: "Kuala Lumpur, Malaysia",
    year: "2023",
    category: "Architecture",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=80"
    ],
    excerpt: "A compact gallery and research archive defined by cantilevered volumes and soft indirect light.",
    description:
      "Axis Gallery creates a careful tension between permanence and adaptability. Its structural frame allows exhibition spaces to change over time, while the facade maintains a strong civic presence along a dense urban edge."
  },
  {
    slug: "atlas-residence",
    title: "Atlas Residence",
    location: "Cox's Bazar, Bangladesh",
    year: "2024",
    category: "Interior",
    image: "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=1800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=1600&q=80"
    ],
    excerpt: "A coastal apartment interior with mineral textures, integrated storage, and measured views.",
    description:
      "Atlas Residence balances domestic ease with architectural discipline. The plan uses continuous joinery, low-sheen stone, and precise furniture placement to keep the compact rooms quiet, open, and highly functional."
  },
  {
    slug: "basalt-tower",
    title: "Basalt Tower",
    location: "Dubai, UAE",
    year: "2026",
    category: "Exterior",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80"
    ],
    excerpt: "A high-rise envelope concept with shaded ribs, sky gardens, and a vertically textured silhouette.",
    description:
      "The facade proposal for Basalt Tower develops a high-performance exterior with a strong urban identity. Deep vertical fins reduce solar gain while planted terraces break the scale and create shared outdoor rooms above the city."
  },
  {
    slug: "greenline-campus",
    title: "Greenline Campus",
    location: "Rajshahi, Bangladesh",
    year: "2022",
    category: "Landscape",
    image: "https://images.unsplash.com/photo-1498429089284-41f8cf3ffd39?auto=format&fit=crop&w=1800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80"
    ],
    excerpt: "A university landscape framework of shaded walks, rain gardens, and flexible outdoor classrooms.",
    description:
      "Greenline Campus establishes a legible landscape structure for long-term growth. Native planting, water-sensitive grading, and generous shaded paths connect academic buildings while preserving informal student life."
  },
  {
    slug: "ordinal-house",
    title: "Ordinal House",
    location: "Tokyo, Japan",
    year: "2023",
    category: "Architecture",
    image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80"
    ],
    excerpt: "A narrow urban house that choreographs daylight through layered rooms and compact courtyards.",
    description:
      "Ordinal House responds to a tight urban site with vertical clarity. Split levels, roof apertures, and small planted courts create a sense of expansion without sacrificing privacy or construction economy."
  }
];

export const team = [
  {
    name: "Nadia Rahman",
    role: "Founding Partner",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    bio: "Leads studio strategy, civic architecture, and research-led design work across South Asia."
  },
  {
    name: "Arman Chowdhury",
    role: "Design Director",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    bio: "Guides concept development with a focus on proportion, material culture, and public experience."
  },
  {
    name: "Mira Sen",
    role: "Interior Lead",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=900&q=80",
    bio: "Develops interior environments where spatial performance and atmosphere carry equal weight."
  },
  {
    name: "Farid Islam",
    role: "Technical Architect",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80",
    bio: "Coordinates detailing, delivery standards, facade systems, and consultant integration."
  },
  {
    name: "Leena Park",
    role: "Landscape Architect",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
    bio: "Shapes climate-responsive landscapes, planting strategies, and water-sensitive public realms."
  },
  {
    name: "Jonas Weber",
    role: "Visualization Artist",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
    bio: "Builds visual narratives for competitions, client presentations, and early spatial studies."
  },
  {
    name: "Tara Ahmed",
    role: "Project Architect",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80",
    bio: "Manages residential and cultural projects from schematic design through construction documentation."
  },
  {
    name: "Rafiq Noor",
    role: "Sustainability Consultant",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80",
    bio: "Advises on passive cooling, resource cycles, carbon-aware specifications, and performance targets."
  }
];

export const offices = [
  "Dhaka / House 18, Road 7, Gulshan",
  "Singapore / 22 Keong Saik Road",
  "Dubai / Design District, Building 5"
];
