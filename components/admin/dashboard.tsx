"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectsManager } from "./projects-manager"
import { TestimonialsManager } from "./testimonials-manager"
import { ServicesManager } from "./services-manager"
import { ContentManager } from "./content-manager"
import { StatsManager } from "./stats-manager"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"

export function AdminDashboard() {
  const router = useRouter()

  const handleLogout = () => {
    document.cookie = "access_token=; path=/; max-age=0"
    document.cookie = "refresh_token=; path=/; max-age=0"
    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage your portfolio content</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2" size={16} />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <ProjectsManager />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialsManager />
          </TabsContent>

          <TabsContent value="services">
            <ServicesManager />
          </TabsContent>

          <TabsContent value="content">
            <ContentManager />
          </TabsContent>

          <TabsContent value="stats">
            <StatsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
