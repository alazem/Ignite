import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

import { getFeaturedProjects, getHomeStats, getFeaturedTestimonials, getContentSection } from "@/lib/content"
import type { Project, Testimonial, HomeStats, ContentSection } from "@/lib/types"

export default function HomePage() {
  const heroContent = getContentSection("hero")
  const missionContent = getContentSection("mission")
  const stats = getHomeStats()
  const testimonials = getFeaturedTestimonials()
  const featuredProjects = getFeaturedProjects(3)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-medium text-muted-foreground mb-4 tracking-wide uppercase">
            {heroContent?.subtitle || "A Creative Team"}
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance">
            {heroContent?.title || "Creating Digital Experiences That Matter"}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            {heroContent?.content ||
              "We transform ideas into exceptional digital products through innovative design and strategic thinking."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/projects">
                View Our Work
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.length > 0 ? (
              stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))
            ) : (
              <>
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold mb-2">150+</div>
                  <div className="text-sm text-muted-foreground">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold mb-2">80+</div>
                  <div className="text-sm text-muted-foreground">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold mb-2">12</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold mb-2">25</div>
                  <div className="text-sm text-muted-foreground">Team Members</div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2 tracking-wide uppercase">Portfolio</p>
              <h2 className="text-4xl font-bold tracking-tight">Selected Projects</h2>
            </div>
            <Button asChild variant="ghost">
              <Link href="/projects">
                View All
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, i) => (
              <Card
                key={project.slug || i}
                className="group overflow-hidden border-0 bg-card hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1 bg-muted rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
            {missionContent?.title || "Our Mission"}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            {missionContent?.content ||
              "To elevate brands through exceptional design and development, creating digital experiences that inspire, engage, and drive meaningful results. We believe in collaboration, innovation, and the pursuit of excellence in everything we create."}
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-sm font-medium text-muted-foreground mb-2 tracking-wide uppercase">Testimonials</p>
            <h2 className="text-4xl font-bold tracking-tight">What Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial, i) => (
              <Card key={testimonial.slug || i} className="border-0 bg-card">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, idx) => (
                      <svg key={idx} className="w-5 h-5 fill-current text-foreground" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm mb-6 leading-relaxed text-pretty">{testimonial.content}</p>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Ready to Start Your Project?</h2>
          <p className="text-lg mb-8 opacity-90 text-pretty">
            Let&apos;s collaborate to create something extraordinary together.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/contact">Start a Conversation</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
