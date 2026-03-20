import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin } from "lucide-react"
import { getContentSection, getContactInfo } from "@/lib/content"
import { FadeIn, StaggerChildren } from "@/components/motion-wrapper"
import { ClickToCall } from "@/components/click-to-call"

export default function ContactPage() {
  const contactContent = getContentSection("contact")
  const contactInfo = getContactInfo()

  const displayContactInfo = contactInfo || {
    email: "ignitetechnologies3@gmail.com",
    phone: "+251913086343/+251933791003",
    address: "Addis Ababa, Ethiopia",
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/alazar-zemene-919aa82b5/",
      twitter: "https://twitter.com/yourteam",
      instagram: "https://instagram.com/_alazar_z",
      github: "https://github.com/yourteam",
    },
  }

  return (
    <div className="min-h-screen">
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <FadeIn className="max-w-7xl mx-auto text-center">
          <p className="text-sm font-medium text-muted-foreground mb-2 tracking-wide uppercase">Get in Touch</p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            {contactContent?.title || "Let's Work Together"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            {contactContent?.content || "Have a project in mind? We'd love to hear from you."}
          </p>
        </FadeIn>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="border-0 bg-card text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <a
                  href={`mailto:${displayContactInfo.email}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {displayContactInfo.email}
                </a>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-3">Phone</h3>
                <ClickToCall phone={displayContactInfo.phone} size="sm" />
              </CardContent>
            </Card>

            <Card className="border-0 bg-card text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Location</h3>
                <p className="text-sm text-muted-foreground">{displayContactInfo.address}</p>
              </CardContent>
            </Card>
          </StaggerChildren>

          <FadeIn delay={0.3}>
            <Card className="border-0 bg-muted/30">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-semibold mb-4">Start a Conversation</h2>
                <p className="text-muted-foreground mb-6 text-pretty">
                  Reach out via email or phone, and we&apos;ll get back to you as soon as possible to discuss your project.
                </p>
                <a
                  href={`mailto:${displayContactInfo.email}`}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Send us an email
                </a>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
