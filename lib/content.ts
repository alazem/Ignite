import fs from "fs"
import path from "path"
import matter from "gray-matter"
import type { Project, Testimonial, Service, HomeStats, ContentSection, ContactInfo } from "./types"

const contentDir = path.join(process.cwd(), "content")

// ── Generic helpers ──────────────────────────────────────────────────────────

function readMarkdownDir<T>(subdir: string): T[] {
  const dir = path.join(contentDir, subdir)
  if (!fs.existsSync(dir)) return []
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"))
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf8")
    const { data, content } = matter(raw)
    const slug = file.replace(/\.md$/, "")
    return { slug, body: content.trim(), ...data } as T
  })
}

function readJsonFile<T>(filePath: string): T | null {
  const fullPath = path.join(contentDir, filePath)
  if (!fs.existsSync(fullPath)) return null
  const raw = fs.readFileSync(fullPath, "utf8")
  return JSON.parse(raw) as T
}

// ── Projects ─────────────────────────────────────────────────────────────────

export function getProjects(): Project[] {
  return readMarkdownDir<Project>("projects").sort((a, b) => a.order - b.order)
}

export function getFeaturedProjects(limit?: number): Project[] {
  const featured = getProjects().filter((p) => p.featured)
  return limit ? featured.slice(0, limit) : featured
}

// ── Testimonials ─────────────────────────────────────────────────────────────

export function getTestimonials(): Testimonial[] {
  return readMarkdownDir<Testimonial>("testimonials").sort((a, b) => a.order - b.order)
}

export function getFeaturedTestimonials(): Testimonial[] {
  return getTestimonials().filter((t) => t.featured)
}

// ── Services ─────────────────────────────────────────────────────────────────

export function getServices(): Service[] {
  return readMarkdownDir<Service>("services").sort((a, b) => a.order - b.order)
}

// ── Page Sections (hero, about, mission, contact) ────────────────────────────

export function getContentSection(section: string): ContentSection | null {
  const all = readMarkdownDir<ContentSection>("pages")
  return all.find((s) => s.section === section) || null
}

export function getAllContentSections(): ContentSection[] {
  return readMarkdownDir<ContentSection>("pages")
}

// ── Site Settings (stats + contact info) ─────────────────────────────────────

interface SiteSettings {
  stats: HomeStats[]
  contact: ContactInfo
}

export function getHomeStats(): HomeStats[] {
  const settings = readJsonFile<SiteSettings>("settings/site.json")
  return settings?.stats || []
}

export function getContactInfo(): ContactInfo | null {
  const settings = readJsonFile<SiteSettings>("settings/site.json")
  return settings?.contact || null
}
