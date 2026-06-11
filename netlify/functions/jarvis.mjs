// JARVIS core uplink — Netlify serverless function
// Keeps your Anthropic API key server-side. The browser never sees it.
//
// Required: set ANTHROPIC_API_KEY in Netlify → Site settings → Environment variables.
// Optional: set JARVIS_MODEL to override the model (defaults to claude-haiku-4-5-20251001,
// the cheapest tier — set it to claude-opus-4-8 if you want maximum brainpower).

export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: { message: "POST only" } }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: {
          message:
            "ANTHROPIC_API_KEY is not set. Add it in Netlify → Site settings → Environment variables, then redeploy.",
        },
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: { message: "Invalid JSON" } }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Only accept what we expect from the frontend; everything else is pinned here.
  const payload = {
    model: process.env.JARVIS_MODEL || "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: body.system,
    messages: body.messages,
    tools: [{ type: "web_search_20250305", name: "web_search" }],
  };

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(payload),
    });

    const data = await upstream.text();
    return new Response(data, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: { message: "Upstream fault: " + err.message } }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const config = { path: "/api/jarvis" };
