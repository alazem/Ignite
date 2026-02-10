"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Linkedin, Github } from "lucide-react"
import type { ContactInfo } from "@/lib/types"

export function Footer() {
  const [contact, setContact] = useState<ContactInfo | null>(null)

  useEffect(() => {
    async function fetchContact() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
        const res = await fetch(`${API_URL}/api/contact-info/`)
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setContact(data[0])
          }
        }
      } catch (error) {
        console.error("Error fetching contact info for footer:", error)
      }
    }
    fetchContact()
  }, [])

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Ignite Technology</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Creating exceptional digital experiences through innovative design and strategic thinking.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/projects"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Work
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Get in Touch</h4>
            {contact && (
              <div className="space-y-2 mb-4">
                <a
                  href={`mailto:${contact.email}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block w-fit"
                >
                  {contact.email}
                </a>
                <p className="text-sm text-muted-foreground">{contact.phone}</p>
              </div>
            )}
            {contact?.socialLinks && (
              <div className="flex gap-4">
                {contact.socialLinks.linkedin && (
                  <a
                    href={contact.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={20} />
                  </a>
                )}

                {contact.socialLinks.github && (
                  <a
                    href={contact.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="GitHub"
                  >
                    <Github size={20} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} IgniteTechnology. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
