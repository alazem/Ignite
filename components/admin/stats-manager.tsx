"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2 } from "lucide-react"
// import { collection, getDocs, orderBy, query } from "firebase/firestore"
// import { db } from "@/lib/firebase"
import { createHomeStat, updateHomeStat, deleteHomeStat, getHomeStats } from "@/lib/api-client"
import type { HomeStats } from "@/lib/types"
import { useRouter } from "next/navigation"

export function StatsManager() {
  const router = useRouter()
  const [stats, setStats] = useState<HomeStats[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    label: "",
    value: "",
    order: 0,
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await getHomeStats()
      setStats(data)
    } catch (error) {
      console.error("[v0] Error loading stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateHomeStat(editingId, formData)
      } else {
        await createHomeStat(formData)
      }

      resetForm()
      loadStats()
      router.refresh()
    } catch (error) {
      console.error("[v0] Error saving stat:", error)
      alert("Error saving stat")
    }
  }

  const handleEdit = (stat: HomeStats) => {
    setEditingId(stat.id)
    setFormData({
      label: stat.label,
      value: stat.value,
      order: stat.order,
    })
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this stat?")) {
      try {
        await deleteHomeStat(id)
        loadStats()
        router.refresh()
      } catch (error) {
        console.error("[v0] Error deleting stat:", error)
        alert("Error deleting stat")
      }
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      label: "",
      value: "",
      order: stats.length,
    })
  }

  if (loading) {
    return <div className="text-center py-8">Loading stats...</div>
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Stat" : "Add New Stat"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Projects Completed"
                  required
                />
              </div>
              <div>
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="150+"
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
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                <Plus className="mr-2" size={16} />
                {editingId ? "Update Stat" : "Add Stat"}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.id}>
            <CardContent className="p-4">
              <div className="text-center mb-3">
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
              <div className="flex gap-2 justify-center">
                <Button size="sm" variant="outline" onClick={() => handleEdit(stat)}>
                  <Pencil size={14} />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(stat.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
