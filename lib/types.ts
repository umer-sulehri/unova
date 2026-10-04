// Shared types for admin-managed content (stored as JSON in data/content).

export interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string;
  categories?: string[];
  liveUrl: string;
  codeUrl: string;
  technologies: string[];
}

export interface ServiceBenefit {
  icon: string;
  title: string;
  description: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface PackageCard {
  name: string;
  tagline: string;
  features: string[];
  highlighted: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Service {
  id: number;
  slug: string;
  title: string;
  icon: string;
  color: string;
  tagline: string;

  // Standard detail sections
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  overview: string[];
  benefits: ServiceBenefit[];
  process: ProcessStep[];
  deliverables: string[];
  tools: string[];
  packages: PackageCard[];
  faq: FaqItem[];

  // Slugs of related projects shown on the detail page
  relatedProjects: string[];
}

export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
}

export interface Brand {
  id: number;
  name: string;
  logo: string;
  website: string;
  description: string;
}

/** Team member shown on the About page, managed from /admin/team. */
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  /** Lower numbers render first. */
  order: number;
}

export interface SiteAddress {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  countryCode: string;
}

/**
 * Single-record collection (id 1) holding the global brand data rendered in the
 * header, footer, contact section and structured data.
 */
export interface SiteSettings {
  id: number;
  siteName: string;
  tagline: string;
  description: string;
  logo: string;
  favicon: string;
  appleIcon: string;
  ogImage: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: SiteAddress;
  businessHours: string;
  mapUrl: string;
  /** Dashboard switch: renders the team section on the About page. */
  showTeamSection: boolean;
  socials: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    behance: string;
    dribbble: string;
    x: string;
  };
}

export const COLLECTIONS = [
  "projects",
  "services",
  "gallery",
  "brands",
  "team",
  "site",
] as const;

export type Collection = (typeof COLLECTIONS)[number];

export type AnyContentItem =
  | Project
  | Service
  | GalleryItem
  | Brand
  | TeamMember
  | SiteSettings;
