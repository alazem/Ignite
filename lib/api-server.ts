"use server"

import type { Project, Testimonial, Service, HomeStats, ContentSection, ContactInfo } from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  try {
    const res = await fetch(`${API_URL}/${endpoint}`, {
      cache: "no-store", // Default to no-store for now, or match revalidate logic
      ...options,
    })

    if (!res.ok) {
      console.error(`API Error ${res.status} on ${endpoint}`)
      return null
    }

    return await res.json()
  } catch (error) {
    console.error(`Fetch error on ${endpoint}:`, error)
    console.error(`Ensure the Django backend is running at ${API_URL}`)
    return null
  }
}

// Helper to ensure Dates are Date objects
const mapProject = (p: any): Project => ({
  ...p,
  createdAt: new Date(p.created_at || p.createdAt),
  updatedAt: new Date(p.updated_at || p.updatedAt),
})

const mapTestimonial = (d: any): Testimonial => ({
  ...d,
  createdAt: new Date(d.created_at || d.createdAt),
  updatedAt: new Date(d.updated_at || d.updatedAt),
})

const mapService = (d: any): Service => ({
  ...d,
  createdAt: new Date(d.created_at || d.createdAt),
  updatedAt: new Date(d.updated_at || d.updatedAt),
})

const mapContent = (d: any): ContentSection => ({
  ...d,
  updatedAt: new Date(d.updated_at || d.updatedAt),
})

const mapContact = (d: any): ContactInfo => ({
  ...d,
  updatedAt: new Date(d.updated_at || d.updatedAt),
})

// Projects
export async function getProjects(): Promise<Project[]> {
  const data = await fetchAPI("projects/")
  return data ? data.map(mapProject) : []
}

export async function getFeaturedProjects(limitCount?: number): Promise<Project[]> {
  let url = "projects/?featured=true"
  if (limitCount) {
    url += `&limit=${limitCount}`
  }
  const data = await fetchAPI(url)
  return data ? data.map(mapProject) : []
}

export async function getProject(id: string): Promise<Project | null> {
  const data = await fetchAPI(`projects/${id}/`)
  return data ? mapProject(data) : null
}

// Testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  const data = await fetchAPI("testimonials/")
  return data ? data.map(mapTestimonial) : []
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  const data = await fetchAPI("testimonials/?featured=true")
  return data ? data.map(mapTestimonial) : []
}

// Services
export async function getServices(): Promise<Service[]> {
  const data = await fetchAPI("services/")
  return data ? data.map(mapService) : []
}

// Home Stats
export async function getHomeStats(): Promise<HomeStats[]> {
  const data = await fetchAPI("home-stats/")
  return data || []
}

// Content Sections
export async function getContentSection(section: ContentSection["section"]): Promise<ContentSection | null> {
  // Our API supports filtering /content/?section=hero
  const data = await fetchAPI(`content/?section=${section}`)
  // API returns a list (filtered). Take the first one.
  if (Array.isArray(data) && data.length > 0) {
    return mapContent(data[0])
  }
  return null
}

export async function getAllContentSections(): Promise<ContentSection[]> {
  const data = await fetchAPI("content/")
  return data ? data.map(mapContent) : []
}

// Contact Info
export async function getContactInfo(): Promise<ContactInfo | null> {
  const data = await fetchAPI("contact-info/")
  // API returns list. Take first.
  if (Array.isArray(data) && data.length > 0) {
    return mapContact(data[0])
  }
  return null
}
