export interface Project {
  id: string
  title: string
  description: string
  imageUrl: string
  tags: string[]
  link?: string
  featured: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  imageUrl?: string
  rating: number
  featured: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface HomeStats {
  id: string
  label: string
  value: string
  order: number
}

export interface ContentSection {
  id: string
  section: "hero" | "about" | "mission" | "contact"
  title: string
  subtitle?: string
  content: string
  imageUrl?: string
  updatedAt: Date
}

export interface ContactInfo {
  id: string
  email: string
  phone: string
  address: string
  socialLinks: {
    linkedin?: string
    twitter?: string
    instagram?: string
    github?: string
  }
  updatedAt: Date
}
