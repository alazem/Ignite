import Image from "next/image"
import { getContentSection } from "@/lib/content"
import { FadeIn, StaggerChildren } from "@/components/motion-wrapper"

export default function AboutPage() {
  const aboutContent = getContentSection("about")

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <FadeIn className="max-w-7xl mx-auto">
          <p className="text-sm font-medium text-muted-foreground mb-2 tracking-wide uppercase">Who We Are</p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">{aboutContent?.title || "About Our Team"}</h1>
        </FadeIn>
      </section>

      {/* Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <p className="text-lg leading-relaxed text-muted-foreground text-pretty">
                {aboutContent?.content ||
                  "We are a collective of designers, developers, and strategists who believe in the power of thoughtful digital experiences. With over a decade of combined experience, we partner with ambitious brands to create products that make a lasting impact."}
              </p>
            </FadeIn>
            {aboutContent?.image && (
              <FadeIn direction="right" delay={0.2}>
                <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={aboutContent.image || "/placeholder.svg"}
                    alt="About our team"
                    fill
                    className="object-cover"
                  />
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-12 text-center">Our Values</h2>
          </FadeIn>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">Excellence</h3>
              <p className="text-muted-foreground text-pretty">
                We strive for the highest quality in every project, paying attention to the smallest details.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">Collaboration</h3>
              <p className="text-muted-foreground text-pretty">
                We work closely with our clients, treating their success as our own.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-muted-foreground text-pretty">
                We embrace new technologies and creative approaches to solve complex challenges.
              </p>
            </div>
          </StaggerChildren>
        </div>
      </section>
    </div>
  )
}
