export interface Project {
  slug?: string
  title: string
  description: string
  image: string
  tags: string[]
  link?: string
  featured: boolean
  order: number
  date?: string
  body?: string
}

export interface Testimonial {
  slug?: string
  name: string
  role: string
  company: string
  content: string
  image?: string
  rating: number
  featured: boolean
  order: number
}

export interface Service {
  slug?: string
  title: string
  description: string
  icon: string
  order: number
}

export interface HomeStats {
  label: string
  value: string
  order: number
}

export interface ContentSection {
  slug?: string
  section: "hero" | "about" | "mission" | "contact"
  title: string
  subtitle?: string
  content: string
  image?: string
}

export interface ContactInfo {
  email: string
  phone: string
  address: string
  socialLinks: {
    linkedin?: string
    twitter?: string
    instagram?: string
    github?: string
  }
}
