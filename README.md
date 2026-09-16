# Shinrai Records — Static Website

This repo contains a simple static website (single-page) to showcase data models stored in the repository (Artist.jsonc, Release.jsonc, NewsPost.jsonc, ...).

What I added
- index.html — full single-page site with sections: Home, Artists, Releases, News, Contact
- styles.css — responsive styling
- app.js — client-side logic that fetches JSONC files from the repository's raw URLs, strips comments and renders lists

How to preview locally
1. Clone the repo
   git clone git@github.com:starlingnx/shinrairecords-.git
   cd shinrairecords-
2. Serve the folder locally (recommended so fetch works without CORS issues)
   - Python: `python -m http.server 8000`
   - Node: `npx serve .`
3. Open http://localhost:8000 in your browser

Notes & next steps
- The site is static: forms are demo-only and do not send emails.
- JSONC parsing is basic — for complex JSONC consider adding a proper JSONC parser (e.g., `jsonc-parser`).
- Enhancements I can add on request:
  - Markdown rendering for README and news content
  - Syntax highlighting and prettier UI
  - Serverless endpoints for contact/subscribe (e.g., Netlify Functions)

