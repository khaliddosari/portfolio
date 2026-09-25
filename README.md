# Khalid Al Dosari's Portfolio

My personal portfolio: projects, experience, certifications and skills. Live at [khalid-ai.dev](https://khalid-ai.dev).

One static page in plain HTML, CSS and JavaScript, with no build step. It has a light navy-glass theme and a dark theme, and is served by Cloudflare Workers.

## Run locally

```
python -m http.server 5599 --directory static
```

Then open http://localhost:5599.

## Deploy

```
npx wrangler deploy
```

Project details and conventions are in [prd/PRD.md](prd/PRD.md).
