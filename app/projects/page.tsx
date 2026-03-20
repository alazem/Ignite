import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import { getProjects } from "@/lib/content"
import { FadeIn, StaggerChildren } from "@/components/motion-wrapper"

export default function ProjectsPage() {
  const projects = getProjects()

  return (
    <div className="min-h-screen">
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <FadeIn className="max-w-7xl mx-auto">
          <p className="text-sm font-medium text-muted-foreground mb-2 tracking-wide uppercase">Portfolio</p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">Our Work</h1>
          <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
            A collection of projects that showcase our expertise in design, development, and digital strategy.
          </p>
        </FadeIn>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-12" staggerDelay={0.12}>
            {projects.map((project, index) => (
              <Card
                key={project.slug || index}
                className="group overflow-hidden border-0 bg-card hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className="aspect-[16/10] relative overflow-hidden bg-muted">
                  <Image
                    src={project.image || "/placeholder.svg"}
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
          </StaggerChildren>
        </div>
      </section>
    </div>
  )
}
