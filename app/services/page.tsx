"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Palette, Code, Layout, Target } from "lucide-react"
import type { Service } from "@/lib/types"

const iconMap: Record<string, any> = {
  palette: Palette,
  code: Code,
  layout: Layout,
  target: Target,
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
        const res = await fetch(`${API_URL}/api/services/`)
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) {
            setServices(data)
          }
        }
      } catch (error) {
        console.error("Error fetching services:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const displayServices =
    services.length > 0
      ? services
      : [
        {
          id: "1",
          title: "Brand Strategy & Identity",
          description:
            "We craft compelling brand narratives and visual identities that resonate with your target audience and stand out in the market.",
          icon: "palette",
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          title: "Web & Mobile Development",
          description:
            "Custom-built websites and applications using cutting-edge technologies to deliver exceptional user experiences.",
          icon: "code",
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "3",
          title: "UX/UI Design",
          description:
            "User-centered design solutions that prioritize functionality, accessibility, and aesthetic excellence.",
          icon: "layout",
          order: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "4",
          title: "Digital Strategy",
          description:
            "Comprehensive digital strategies that align with your business goals and drive measurable results.",
          icon: "target",
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
          <p className="text-sm font-medium text-muted-foreground mb-2 tracking-wide uppercase">What We Do</p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">Our Services</h1>
          <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
            Comprehensive design and development solutions tailored to elevate your brand and achieve your business
            goals.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayServices.map((service) => {
              const IconComponent = iconMap[service.icon] || Target
              return (
                <Card key={service.id} className="border-0 bg-card hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                      <IconComponent className="w-7 h-7 text-primary" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-4">{service.title}</h2>
                    <p className="text-muted-foreground leading-relaxed text-pretty">{service.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Interested in working together?</h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            Let's discuss how we can help bring your vision to life.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  )
}
