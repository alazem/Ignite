import { redirect } from "next/navigation"

export default function AdminPage() {
  // Redirect to the Decap CMS admin page (served as static HTML from public/)
  redirect("/admin/index.html")
}
