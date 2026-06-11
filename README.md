# J.A.R.V.I.S. — Netlify Deployment

A voice-controlled AI assistant powered by Claude (Haiku 4.5 by default), with web search,
speech recognition, and spoken replies.

## Why this version exists

The claude.ai artifact version gets free, keyless API access injected by the
claude.ai platform. That access does not travel with the file — on Netlify you
must supply your own Anthropic API key. This package keeps that key safely in
a serverless function, never in the browser.

## Deploy in 5 steps

1. Get an API key at https://console.anthropic.com (Settings → API keys).
   Note: API usage is billed to your account. This package defaults to
   claude-haiku-4-5-20251001, the cheapest model tier. To upgrade the brain,
   set the JARVIS_MODEL environment variable to claude-sonnet-4-6 (mid-tier)
   or claude-opus-4-8 (smartest, most expensive).

2. Deploy this folder to Netlify:
   - Easiest: drag-and-drop will NOT work for functions — instead push this
     folder to a GitHub repo and use Netlify "Import from Git", or
   - CLI: `npm i -g netlify-cli`, then `netlify deploy --prod` from this folder.

3. In Netlify: Site configuration → Environment variables → add
   ANTHROPIC_API_KEY = your key. (Optional: JARVIS_MODEL to change models)

4. Redeploy so the variable takes effect.

5. Open your site. Tap the arc reactor, allow the microphone, and speak.

## What works here vs. the claude.ai version

- Microphone / speech recognition: WORKS (no sandbox restrictions) —
  Chrome, Edge, or Safari required; Firefox lacks the speech API.
- Spoken replies: WORKS (Edge has the best free "Natural" voices).
- Claude brain: WORKS (via your API key; Haiku 4.5 by default).
- Web search: WORKS (built into the API call).
- Your claude.ai connectors (Gmail, Calendar, Drive, Canva, Zoho, Zoom):
  NOT available — those are authenticated through your claude.ai account
  session and cannot be reached from an external site. Connecting them
  here would require setting up your own OAuth credentials per service.

## Cost & safety notes

- Every message hits your API key. Do not share your site URL publicly
  unless you are happy paying for strangers' conversations — consider
  Netlify password protection (Site configuration → Access control).
- The key lives only in the Netlify environment variable. Never paste it
  into index.html.
