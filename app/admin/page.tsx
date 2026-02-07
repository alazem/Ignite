import { AdminDashboard } from "@/components/admin/dashboard"

export const metadata = {
  title: "Admin Dashboard - Studio",
  description: "Manage your portfolio content",
}

export default async function AdminPage() {
  // This will be protected by middleware
  return <AdminDashboard />
}
