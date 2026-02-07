"use client"

import type { Project, Testimonial, Service, HomeStats, ContentSection, ContactInfo } from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"

function getCookie(name: string) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift()
  return null
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = getCookie("access_token")
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  }

  // Only set Content-Type to json if body is NOT FormData
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json"
  }

  const res = await fetch(`${API_URL}/${endpoint}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error(`API Error ${res.status} on ${endpoint}: ${errorText}`)
    throw new Error(`API Error: ${res.statusText}`)
  }

  // Handle 204 No Content
  if (res.status === 204) return null

  return res.json()
}

// Helpers
const mapDate = (d: any) => (d ? new Date(d) : new Date())

const mapProject = (p: any): Project => ({
  ...p,
  createdAt: mapDate(p.created_at || p.createdAt), // API returns snake_case usually, but we aliased in serializer? No, default ModelSerializer uses camelCase? No, default is snake_case unless configured.
  // Wait, serializer fields are snake_case by default. api/serializers.py did NOT rename created_at/updated_at.
  // So API returns created_at.
  // But type Project has createdAt.
  // I need to map keys too.
  updatedAt: mapDate(p.updated_at || p.updatedAt),
})

const mapTestimonial = (p: any): Testimonial => ({
  ...p,
  createdAt: mapDate(p.created_at || p.createdAt),
  updatedAt: mapDate(p.updated_at || p.updatedAt),
})

const mapService = (p: any): Service => ({
  ...p,
  createdAt: mapDate(p.created_at || p.createdAt),
  updatedAt: mapDate(p.updated_at || p.updatedAt),
})

const mapContent = (p: any): ContentSection => ({
  ...p,
  updatedAt: mapDate(p.updated_at || p.updatedAt),
})

// Projects CRUD
export async function getProjects(): Promise<Project[]> {
  const data = await fetchAPI("projects/")
  return data ? data.map(mapProject) : []
}

export async function createProject(data: FormData | Omit<Project, "id" | "createdAt" | "updatedAt">) {
  const isFormData = data instanceof FormData
  return await fetchAPI("projects/", {
    method: "POST",
    body: isFormData ? data : JSON.stringify(data),
  })
}

export async function updateProject(id: string, data: FormData | Partial<Project>) {
  const isFormData = data instanceof FormData
  return await fetchAPI(`projects/${id}/`, {
    method: "PATCH",
    body: isFormData ? data : JSON.stringify(data),
  })
}

export async function deleteProject(id: string) {
  return await fetchAPI(`projects/${id}/`, {
    method: "DELETE",
  })
}

// Testimonials CRUD
export async function getTestimonials(): Promise<Testimonial[]> {
  const data = await fetchAPI("testimonials/")
  return data ? data.map(mapTestimonial) : []
}

export async function createTestimonial(data: Omit<Testimonial, "id" | "createdAt" | "updatedAt">) {
  return await fetchAPI("testimonials/", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateTestimonial(id: string, data: Partial<Testimonial>) {
  return await fetchAPI(`testimonials/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteTestimonial(id: string) {
  return await fetchAPI(`testimonials/${id}/`, {
    method: "DELETE",
  })
}

// Services CRUD
export async function getServices(): Promise<Service[]> {
  const data = await fetchAPI("services/")
  return data ? data.map(mapService) : []
}

export async function createService(data: Omit<Service, "id" | "createdAt" | "updatedAt">) {
  return await fetchAPI("services/", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateService(id: string, data: Partial<Service>) {
  return await fetchAPI(`services/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteService(id: string) {
  return await fetchAPI(`services/${id}/`, {
    method: "DELETE",
  })
}

// Home Stats CRUD
export async function getHomeStats(): Promise<HomeStats[]> {
  const data = await fetchAPI("home-stats/")
  return data || []
}

export async function updateHomeStat(id: string, data: Partial<HomeStats>) {
  return await fetchAPI(`home-stats/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function createHomeStat(data: Omit<HomeStats, "id">) {
  return await fetchAPI("home-stats/", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function deleteHomeStat(id: string) {
  return await fetchAPI(`home-stats/${id}/`, {
    method: "DELETE",
  })
}

// Content Sections CRUD
export async function getAllContentSections(): Promise<ContentSection[]> {
  const data = await fetchAPI("content/")
  return data ? data.map(mapContent) : []
}

export async function updateContentSection(id: string, data: Partial<ContentSection>) {
  // ID from firebase was string, here it might be stringified int.
  // Our API handles it.
  return await fetchAPI(`content/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function createContentSection(data: Omit<ContentSection, "id" | "updatedAt">) {
  return await fetchAPI("content/", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// Contact Info CRUD
export async function updateContactInfo(id: string, data: Partial<ContactInfo>) {
  return await fetchAPI(`contact-info/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function createContactInfo(data: Omit<ContactInfo, "id" | "updatedAt">) {
  return await fetchAPI("contact-info/", {
    method: "POST",
    body: JSON.stringify(data),
  })
}
