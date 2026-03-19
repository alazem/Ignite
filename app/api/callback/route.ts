import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.json({ error: "No code provided from GitHub" }, { status: 400 })
  }

  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "OAuth credentials not configured" }, { status: 500 })
  }

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
      console.error("GitHub OAuth error:", data)
      return NextResponse.json({ error: data.error_description || data.error }, { status: 401 })
    }

    const token = data.access_token
    const provider = "github"

    // Decap CMS expects this exact postMessage format
    const content = `<!DOCTYPE html>
<html>
<head><title>Authorizing...</title></head>
<body>
<script>
(function() {
  var token = "${token}";
  var provider = "${provider}";

  function receiveMessage(e) {
    window.opener.postMessage(
      "authorization:" + provider + ":success:" + JSON.stringify({ token: token, provider: provider }),
      e.origin
    );
  }

  window.addEventListener("message", receiveMessage, false);
  window.opener.postMessage("authorizing:" + provider, "*");
})();
</script>
</body>
</html>`

    return new NextResponse(content, {
      headers: { "Content-Type": "text/html" },
    })
  } catch (error) {
    console.error("Auth callback error:", error)
    return NextResponse.json({ error: "Failed to exchange code for token" }, { status: 500 })
  }
}
