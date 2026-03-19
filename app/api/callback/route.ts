import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.json({ error: "No code provided from GitHub" }, { status: 400 })
  }

  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET

  try {
    // Exchange code for access token
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }),
    })

    const data = await response.json()

    if (data.error) {
      return NextResponse.json({ error: data.error_description || data.error }, { status: 401 })
    }

    // Decap CMS uses simple-oauth2 pattern and expects a postMessage back to the window.opener
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authorizing...</title>
      </head>
      <body>
        <script>
          (function() {
            function receiveMessage(e) {
              console.log("receiveMessage %o", e);
              // Send the results back to the CMS!
              window.opener.postMessage(
                'authorization:github:success:${JSON.stringify(data)}',
                e.origin
              );
            }
            window.addEventListener("message", receiveMessage, false);
            // Tell the CMS we are ready to send the token
            window.opener.postMessage("authorizing:github", "*");
          })()
        </script>
      </body>
      </html>
    `

    return new NextResponse(content, {
      headers: { "Content-Type": "text/html" },
    })
  } catch (error) {
    console.error("Auth callback error:", error)
    return NextResponse.json({ error: "Failed to exchange code for token" }, { status: 500 })
  }
}
