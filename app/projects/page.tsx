"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import { getProjects } from "@/lib/api-client"
import type { Project } from "@/lib/types"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProjects()
        setProjects(data)
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const displayProjects =
    projects.length > 0
      ? projects
      : [
        {
          id: "1",
          title: "E-Commerce Platform Redesign",
          description:
            "Complete redesign and development of a modern e-commerce platform with advanced filtering and seamless checkout experience.",
          imageUrl: "/.jpg?key=ecommerce&height=600&width=800&query=modern ecommerce platform",
          tags: ["Design", "Development", "E-Commerce"],
          link: "https://example.com",
          featured: true,
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          title: "Corporate Brand Identity",
          description:
            "Comprehensive brand identity system including logo, guidelines, and marketing materials for a fintech startup.",
          imageUrl: "/.jpg?key=brand&height=600&width=800&query=corporate brand identity",
          tags: ["Branding", "Design"],
          featured: true,
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "3",
          title: "Mobile App Development",
          description:
            "Native iOS and Android app for fitness tracking with real-time analytics and social features.",
          imageUrl: "/.jpg?key=mobile&height=600&width=800&query=mobile app interface",
          tags: ["Mobile", "Development", "UX/UI"],
          featured: false,
          order: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "4",
          title: "SaaS Dashboard Design",
          description: "Intuitive dashboard interface for a B2B analytics platform with complex data visualization.",
          imageUrl: "/.jpg?key=saas&height=600&width=800&query=saas dashboard interface",
          tags: ["Design", "SaaS", "Data Visualization"],
          featured: true,
          order: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm font-medium text-muted-foreground mb-2 tracking-wide uppercase">Portfolio</p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">Our Work</h1>
          <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
            A collection of projects that showcase our expertise in design, development, and digital strategy.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {displayProjects.map((project, index) => (
              <Card
                key={project.id}
                className="group overflow-hidden border-0 bg-card hover:shadow-xl transition-all duration-500"
              >
                <div className="aspect-[16/10] relative overflow-hidden bg-muted">
                  <Image
                    src={project.imageUrl || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority={index < 2}
                  />
                </div>
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-2xl font-semibold group-hover:text-muted-foreground transition-colors">
                      {project.title}
                    </h2>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="View project"
                      >
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
