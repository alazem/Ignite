"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2 } from "lucide-react"
// import { collection, getDocs, orderBy, query } from "firebase/firestore"
// import { db } from "@/lib/firebase"
import { createService, updateService, deleteService, getServices } from "@/lib/api-client"
import type { Service } from "@/lib/types"
import { useRouter } from "next/navigation"

export function ServicesManager() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "target",
    order: 0,
  })

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      const data = await getServices()
      setServices(data)
    } catch (error) {
      console.error("[v0] Error loading services:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateService(editingId, formData)
      } else {
        await createService({ ...formData })
      }

      resetForm()
      loadServices()
      router.refresh()
    } catch (error) {
      console.error("[v0] Error saving service:", error)
      alert("Error saving service")
    }
  }

  const handleEdit = (service: Service) => {
    setEditingId(service.id)
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      order: service.order,
    })
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService(id)
        loadServices()
        router.refresh()
      } catch (error) {
        console.error("[v0] Error deleting service:", error)
        alert("Error deleting service")
      }
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      title: "",
      description: "",
      icon: "target",
      order: services.length,
    })
  }

  if (loading) {
    return <div className="text-center py-8">Loading services...</div>
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Service" : "Add New Service"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="icon">Icon</Label>
                <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                  <SelectTrigger id="icon">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="palette">Palette</SelectItem>
                    <SelectItem value="code">Code</SelectItem>
                    <SelectItem value="layout">Layout</SelectItem>
                    <SelectItem value="target">Target</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) })}
                className="w-32"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                <Plus className="mr-2" size={16} />
                {editingId ? "Update Service" : "Add Service"}
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
        {services.map((service) => (
          <Card key={service.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(service)}>
                    <Pencil size={14} />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(service.id)}>
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
