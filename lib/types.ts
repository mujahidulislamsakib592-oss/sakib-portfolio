export type SiteSettings = {
  id: number;
  site_name: string;
  owner_name: string;
  hero_title: string;
  hero_subtitle: string;
  bio: string;
  email: string;
  phone: string;
  whatsapp: string;
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  github: string | null;
  photo_url: string | null;
};

export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string | null;
  featured: boolean;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  price: string | null;
};
