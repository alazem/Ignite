"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
// import { collection, getDocs } from "firebase/firestore"
// import { db } from "@/lib/firebase"
import { updateContentSection, getAllContentSections } from "@/lib/api-client"
import type { ContentSection } from "@/lib/types"
import { useRouter } from "next/navigation"

export function ContentManager() {
  const router = useRouter()
  const [sections, setSections] = useState<ContentSection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSections()
  }, [])

  const loadSections = async () => {
    try {
      const data = await getAllContentSections()
      setSections(data)
    } catch (error) {
      console.error("[v0] Error loading content sections:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id: string, data: Partial<ContentSection>) => {
    try {
      await updateContentSection(id, data)
      loadSections()
      router.refresh()
      alert("Content updated successfully!")
    } catch (error) {
      console.error("[v0] Error updating content:", error)
      alert("Error updating content")
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading content sections...</div>
  }

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <Card key={section.id}>
          <CardHeader>
            <CardTitle className="capitalize">{section.section} Section</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleUpdate(section.id, {
                  title: formData.get("title") as string,
                  subtitle: formData.get("subtitle") as string,
                  content: formData.get("content") as string,
                  imageUrl: formData.get("imageUrl") as string,
                })
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor={`${section.id}-title`}>Title</Label>
                <Input id={`${section.id}-title`} name="title" defaultValue={section.title} required />
              </div>

              {section.subtitle !== undefined && (
                <div>
                  <Label htmlFor={`${section.id}-subtitle`}>Subtitle</Label>
                  <Input id={`${section.id}-subtitle`} name="subtitle" defaultValue={section.subtitle || ""} />
                </div>
              )}

              <div>
                <Label htmlFor={`${section.id}-content`}>Content</Label>
                <Textarea
                  id={`${section.id}-content`}
                  name="content"
                  defaultValue={section.content}
                  rows={5}
                  required
                />
              </div>

              {section.imageUrl !== undefined && (
                <div>
                  <Label htmlFor={`${section.id}-imageUrl`}>Image URL</Label>
                  <Input id={`${section.id}-imageUrl`} name="imageUrl" defaultValue={section.imageUrl || ""} />
                </div>
              )}

              <Button type="submit">Update {section.section}</Button>
            </form>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
