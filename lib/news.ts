export type NewsItem = {
  slug: string;
  title: string;
  date: string;
  category: string;
  image: string;
  gallery: string[];
  excerpt: string;
  body: string[];
};

export const newsItems: NewsItem[] = [
  {
    slug: "meridian-pavilion-award-shortlist",
    title: "Meridian Pavilion shortlisted for a regional civic design award",
    date: "July 2026",
    category: "Awards",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=1600&q=80"
    ],
    excerpt:
      "The placeholder pavilion study has been recognized for its public ground strategy and climate-responsive envelope.",
    body: [
      "Meridian Pavilion has been shortlisted in a regional civic design program for its measured approach to public space, shaded circulation, and adaptable cultural programming.",
      "The proposal is organized around a porous ground plane that welcomes informal gathering while maintaining a clear ceremonial identity. Deep facade elements and planted thresholds temper daylight and reduce heat gain.",
      "This dummy news article is written as placeholder content for the prototype. It can later be replaced by press releases, award citations, juror comments, and project photography."
    ]
  },
  {
    slug: "shaded-thresholds-research-note",
    title: "Studio research note: shaded thresholds in humid cities",
    date: "June 2026",
    category: "Research",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80"
    ],
    excerpt:
      "A short dummy publication outlining how verandas, arcades, and deep facades can extend civic comfort.",
    body: [
      "The studio's latest placeholder research note studies threshold spaces in humid urban environments, with attention to shade, airflow, social occupation, and maintenance.",
      "Rather than treating the facade as a thin boundary, the note frames it as a climatic room: a zone where movement, waiting, cooling, and gathering can happen together.",
      "Future real content could include diagrams, environmental analysis, precedent studies, and material testing documentation."
    ]
  },
  {
    slug: "singapore-project-room",
    title: "Atelier Northline opens a temporary project room in Singapore",
    date: "May 2026",
    category: "Studio",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80"
    ],
    excerpt:
      "The temporary workspace supports hospitality interiors, cultural competitions, and regional consultant workshops.",
    body: [
      "Atelier Northline has opened a temporary project room in Singapore to support regional collaboration, consultant coordination, and client workshops.",
      "The compact workspace is planned around pin-up walls, model tables, digital review stations, and a flexible meeting area for fast design cycles.",
      "This page uses dummy content and placeholder imagery, keeping the structure ready for real studio announcements."
    ]
  },
  {
    slug: "greenline-campus-documentation",
    title: "Greenline Campus landscape framework moves into documentation",
    date: "April 2026",
    category: "Projects",
    image: "https://images.unsplash.com/photo-1498429089284-41f8cf3ffd39?auto=format&fit=crop&w=1800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80"
    ],
    excerpt:
      "The campus landscape proposal advances with rain gardens, shaded walks, and outdoor teaching rooms.",
    body: [
      "Greenline Campus has moved into documentation, advancing a landscape framework of shaded pedestrian routes, planted water systems, and flexible outdoor learning spaces.",
      "The project organizes daily campus life around shade, seasonal planting, and clear circulation links between academic buildings.",
      "The prototype article demonstrates how milestone updates can carry project context, image galleries, and longer editorial copy."
    ]
  }
];
