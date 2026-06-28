import type { ApiResponse, Project, SkillGroup, Experience, Post, Category, Tag } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/v1";

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${endpoint}`);
  }

  const json: ApiResponse<T> = await res.json();
  return json.data;
}

// Projects
export const getProjects = () =>
  apiFetch<Project[]>("/projects", { next: { revalidate: 3600 } });

export const getFeaturedProjects = () =>
  apiFetch<Project[]>("/projects/featured", { next: { revalidate: 3600 } });

export const getProject = (slug: string) =>
  apiFetch<Project>(`/projects/${slug}`, { next: { revalidate: 3600 } });

// Skills
export const getSkills = () =>
  apiFetch<SkillGroup[]>("/skills", { next: { revalidate: 86400 } });

// Experience
export const getExperience = () =>
  apiFetch<Experience[]>("/experience", { next: { revalidate: 86400 } });

// Blog
export const getPosts = (page = 1, limit = 6) =>
  apiFetch<Post[]>(`/posts?page=${page}&limit=${limit}`, { next: { revalidate: 1800 } });

export const getFeaturedPosts = () =>
  apiFetch<Post[]>("/posts/featured", { next: { revalidate: 1800 } });

export const getPost = (slug: string) =>
  apiFetch<Post>(`/posts/${slug}`, { next: { revalidate: 1800 } });

export const getCategories = () =>
  apiFetch<Category[]>("/categories", { next: { revalidate: 86400 } });

export const getTags = () =>
  apiFetch<Tag[]>("/tags", { next: { revalidate: 86400 } });

// Contact
export async function submitContact(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to send message");
  }

  return res.json();
}
