import { NextResponse } from "next/server"

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID

  if (!clientId) {
    return NextResponse.json({ error: "GITHUB_CLIENT_ID is not configured in Vercel" }, { status: 500 })
  }

  // Redirect to GitHub for authorization
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,user`

  return NextResponse.redirect(githubAuthUrl)
}
