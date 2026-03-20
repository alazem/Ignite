import { Card, CardContent } from "@/components/ui/card"
import { Palette, Code, Layout, Target } from "lucide-react"
import { getServices } from "@/lib/content"
import { FadeIn, StaggerChildren } from "@/components/motion-wrapper"

const iconMap: Record<string, any> = {
  palette: Palette,
  code: Code,
  layout: Layout,
  target: Target,
}

export default function ServicesPage() {
  const services = getServices()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <FadeIn className="max-w-7xl mx-auto">
          <p className="text-sm font-medium text-muted-foreground mb-2 tracking-wide uppercase">What We Do</p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">Our Services</h1>
          <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
            Comprehensive design and development solutions tailored to elevate your brand and achieve your business
            goals.
          </p>
        </FadeIn>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-8" staggerDelay={0.1}>
            {services.map((service) => {
              const IconComponent = iconMap[service.icon] || Target
              return (
                <Card key={service.slug} className="border-0 bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="w-7 h-7 text-primary" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-4">{service.title}</h2>
                    <p className="text-muted-foreground leading-relaxed text-pretty">{service.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* CTA Section */}
      <FadeIn>
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Interested in working together?</h2>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Let&apos;s discuss how we can help bring your vision to life.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </section>
      </FadeIn>
    </div>
  )
}
