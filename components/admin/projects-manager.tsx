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
import { createProject, updateProject, deleteProject, getProjects } from "@/lib/api-client"
import { revalidateContent } from "@/app/actions"
import type { Project } from "@/lib/types"
import { useRouter } from "next/navigation"

export function ProjectsManager() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    tags: "",
    link: "",
    featured: false,
    order: 0,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const data = await getProjects()
      setProjects(data)
    } catch (error) {
      console.error("[v0] Error loading projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Basic client-side validation to ensure responsiveness
    if (!formData.title.trim()) return setError("Title is required")
    if (!formData.description.trim()) return setError("Description is required")
    if (!formData.imageUrl.trim() && !imageFile && !editingId) return setError("Image is required")
    if (!formData.tags.trim()) return setError("At least one tag is required")

    setSaving(true)
    try {
      const data = new FormData()
      data.append("title", formData.title)
      data.append("description", formData.description)
      data.append("tags", JSON.stringify(formData.tags.split(",").map((t) => t.trim())))
      data.append("link", formData.link || "")
      data.append("featured", String(formData.featured))
      data.append("order", String(formData.order))
      // If we have an image file, use it. Otherwise, use the fallback URL if provided.
      if (imageFile) {
        data.append("image", imageFile)
      } else if (formData.imageUrl) {
        data.append("image_url_fallback", formData.imageUrl)
      }

      if (editingId) {
        console.log("Updating project:", editingId)
        await updateProject(editingId, data)
      } else {
        console.log("Creating new project")
        await createProject(data)
      }
      console.log("Project saved to Firestore")

      resetForm()
      loadProjects()
      await revalidateContent()
      router.refresh()
      setSuccess(editingId ? "Project updated" : "Project added")
    } catch (error) {
      console.error("[v0] Error saving project:", error)
      setError("Error saving project. Please try again.")
    }
    finally {
      setSaving(false)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingId(project.id)
    setFormData({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      tags: project.tags.join(", "),
      link: project.link || "",
      featured: project.featured,
      order: project.order,
    })
    setImageFile(null)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id)
        loadProjects()
        await revalidateContent()
        router.refresh()
      } catch (error) {
        console.error("[v0] Error deleting project:", error)
        alert("Error deleting project")
      }
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      tags: "",
      link: "",
      featured: false,
      order: projects.length,
    })
    setImageFile(null)
  }

  if (loading) {
    return <div className="text-center py-8">Loading projects...</div>
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Project" : "Add New Project"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm bg-destructive/10 text-destructive rounded-md">
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 p-3 text-sm bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 rounded-md">
                {success}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="image">Project Image</Label>
                <div className="space-y-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                  <div className="text-xs text-muted-foreground text-center">- OR -</div>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="Image URL (fallback)"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Design, Development, Branding"
                />
              </div>
              <div>
                <Label htmlFor="link">Project Link (optional)</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://..."
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
              <Button type="submit" disabled={saving}>
                <Plus className="mr-2" size={16} />
                {saving ? (editingId ? "Updating..." : "Adding...") : editingId ? "Update Project" : "Add Project"}
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
        {projects.map((project) => (
          <Card key={project.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{project.title}</h3>
                    {project.featured && (
                      <span className="text-xs px-2 py-0.5 bg-primary text-primary-foreground rounded">Featured</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-muted rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(project)}>
                    <Pencil size={14} />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(project.id)}>
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
