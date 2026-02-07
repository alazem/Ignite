"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2 } from "lucide-react"
// import { collection, getDocs, orderBy, query } from "firebase/firestore"
// import { db } from "@/lib/firebase"
import { createTestimonial, updateTestimonial, deleteTestimonial, getTestimonials } from "@/lib/api-client"
import type { Testimonial } from "@/lib/types"
import { useRouter } from "next/navigation"

export function TestimonialsManager() {
  const router = useRouter()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    imageUrl: "",
    rating: 5,
    featured: false,
    order: 0,
  })

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    try {
      const data = await getTestimonials()
      setTestimonials(data)
    } catch (error) {
      console.error("[v0] Error loading testimonials:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateTestimonial(editingId, formData)
      } else {
        await createTestimonial({ ...formData })
      }

      resetForm()
      loadTestimonials()
      router.refresh()
    } catch (error) {
      console.error("[v0] Error saving testimonial:", error)
      alert("Error saving testimonial")
    }
  }

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id)
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company,
      content: testimonial.content,
      imageUrl: testimonial.imageUrl || "",
      rating: testimonial.rating,
      featured: testimonial.featured,
      order: testimonial.order,
    })
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      try {
        await deleteTestimonial(id)
        loadTestimonials()
        router.refresh()
      } catch (error) {
        console.error("[v0] Error deleting testimonial:", error)
        alert("Error deleting testimonial")
      }
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      name: "",
      role: "",
      company: "",
      content: "",
      imageUrl: "",
      rating: 5,
      featured: false,
      order: testimonials.length,
    })
  }

  if (loading) {
    return <div className="text-center py-8">Loading testimonials...</div>
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Testimonial" : "Add New Testimonial"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="content">Testimonial Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="imageUrl">Image URL (optional)</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="/placeholder.svg?height=200&width=200"
                />
              </div>
              <div>
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number.parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) })}
                  className="w-20"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                <Plus className="mr-2" size={16} />
                {editingId ? "Update Testimonial" : "Add Testimonial"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    {testimonial.featured && (
                      <span className="text-xs px-2 py-0.5 bg-primary text-primary-foreground rounded">Featured</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {testimonial.role}, {testimonial.company}
                  </p>
                  <p className="text-sm">{testimonial.content}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(testimonial)}>
                    <Pencil size={14} />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(testimonial.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
