export interface Project {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  tech_stack: string[];
  features: string[];
  challenges: string;
  solutions: string;
  lessons: string;
  github_url: string;
  live_url: string;
  thumbnail: string;
  screenshots: string[];
  is_featured: boolean;
  sort_order: number;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  icon_name: string;
  sort_order: number;
}

export interface SkillGroup {
  category: string;
  skills: Skill[];
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  description: string;
  highlights: string[];
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  location: string;
  type: "full-time" | "part-time" | "freelance" | "contract";
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  is_featured: boolean;
  status: "draft" | "published";
  views: number;
  read_time: number;
  published_at: string;
  created_at: string;
  updated_at: string;
  categories: Category[];
  tags: Tag[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  meta?: {
    page: number;
    total: number;
    per_page: number;
    last_page: number;
  };
}
