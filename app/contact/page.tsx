"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin } from "lucide-react"
import type { ContentSection, ContactInfo } from "@/lib/types"

export default function ContactPage() {
  const [contactContent, setContactContent] = useState<ContentSection | null>(null)
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
        const [contentRes, infoRes] = await Promise.all([
          fetch(`${API_URL}/api/content/?section=contact`),
          fetch(`${API_URL}/api/contact-info/`),
        ])

        if (contentRes.ok) {
          const data = await contentRes.json()
          if (Array.isArray(data) && data.length > 0) setContactContent(data[0])
        }
        if (infoRes.ok) {
          const data = await infoRes.json()
          // API might return array or object depending on implementation, 
          // but lib/api-server.ts logic suggests it returns an array for contact-info/ and takes the first one.
          // Let's check api-server.ts logic again. 
          // "if (Array.isArray(data) && data.length > 0) return mapContact(data[0])"
          // So we should handle array.
          if (Array.isArray(data) && data.length > 0) setContactInfo(data[0])
        }

      } catch (error) {
        console.error("Error fetching contact data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const displayContactInfo = contactInfo || {
    id: "1",
    email: "ignitetechnologies3@gmail.com",
    phone: "+251913086343/+251933791003",
    address: "Addis Ababa, Ethiopia",
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/alazar-zemene-919aa82b5/",
      twitter: "https://twitter.com/yourteam",
      instagram: "https://instagram.com/_alazar_z",
      github: "https://github.com/yourteam",
    },
    updatedAt: new Date(),
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm font-medium text-muted-foreground mb-2 tracking-wide uppercase">Get in Touch</p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            {contactContent?.title || "Let's Work Together"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            {contactContent?.content || "Have a project in mind? We'd love to hear from you."}
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="border-0 bg-card text-center">
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

            <Card className="border-0 bg-card text-center">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Phone</h3>
                <a
                  href={`tel:${displayContactInfo.phone}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {displayContactInfo.phone}
                </a>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card text-center">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Location</h3>
                <p className="text-sm text-muted-foreground">{displayContactInfo.address}</p>
              </CardContent>
            </Card>
          </div>

          {/* Simple Contact Message */}
          <Card className="border-0 bg-muted/30">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Start a Conversation</h2>
              <p className="text-muted-foreground mb-6 text-pretty">
                Reach out via email or phone, and we'll get back to you as soon as possible to discuss your project.
              </p>
              <a
                href={`mailto:${displayContactInfo.email}`}
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Send us an email
              </a>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
