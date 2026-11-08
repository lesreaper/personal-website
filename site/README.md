# Richard Everts

A research-led personal site connecting intelligence, engineering, film, books, and human agency. Content is stored as Markdown and a shared profile record. Vinext renders the pages to portable static HTML; interactive visuals and archive controls enhance the rendered content.

## Local development

Use Node.js 24 and the committed package lock.

```bash
npm ci
npm run dev
```

For a production build and local release verification:

```bash
npm run build
node scripts/verify-public.mjs
node scripts/serve.mjs --host 127.0.0.1 --port 4173
```

Release verification requires Poppler’s `pdftotext` and `pdfinfo` programs, supplied by `poppler-utils` on Debian or Ubuntu. Railway installs these during its build through `RAILPACK_BUILD_APT_PACKAGES=poppler-utils`, so production runs the same full PDF privacy checks as local builds. The server serves only `dist/client`, returns actual 404 status codes, and redirects the `www` hostname and the documented legacy article path. Development source directories are never served.

## Add or update work

Add a Markdown file to one of `content/research`, `content/work`, `content/writing`, or `content/speaking`. Keep dates quoted so the YAML parser retains their known precision. Use a four-digit year when the exact date is unknown; never infer an event date from an article's publication date.

```yaml
---
title: "A descriptive title"
slug: "a-descriptive-title"
category: "research"
kind: "Technical note"
date: "2026-11-08"
dateLabel: "November 8, 2026"
status: "Current"
summary: "An original, concise description of what this work contributes."
topics:
  - "Simulation"
role: "Author"
authors:
  - "Richard Everts"
sources:
  - label: "Original publication"
    url: "https://www.siml.life/research"
featured: false
---

Write the body here with substantive context and precise attribution.
```

Optional fields are `featured` (boolean), `related` (an array of existing slugs), `externalUrl`, `cover` (an existing public image path), and `videoId` (a verified eleven-character YouTube ID). A slug must be unique across the full archive. Keep slugs stable after publication; if one must change, add a permanent redirect at the hosting layer.

The content loader and release verifier check the fields, links, original sources, publication metadata, Markdown alternatives, and JSON-LD. Topic filters and search are generated from these same records. Homepage selections are curated by slug in `app/page.tsx`; archive records also retain a `featured` field for future editorial use.

## Sources and identity

Each work must have source links and explicit authorship and role information. Richard Everts also appears as Rich Everts, Richard C. Everts, and The Operator. Owner confirmation establishes the connection to The Operator; do not infer sole authorship from his publication or stewardship of lab work.

Searches also return a New Zealand medical specialist named Richard Everts. A name match is insufficient. Before adding a record, match a known profile, affiliation, research subject, first-person account, or direct link from Richard's established work. Do not add the medical namesake's clinical publications or conference appearances.

Preserve publication status: a preprint, prototype, reported lab benchmark, commentary, or archived position is not an independently validated finding. Keep historical work accessible and label its context. Verify individual award credits; the AIR Framework runner-up attribution is confirmed by the owner and his supplied resume.

Do not invent missing recordings, assign unknown dates, aggregate cohort funding into a personal grant figure, or imply that a speaker acknowledged in proceedings is an article coauthor. Use source links when a recording is unavailable. New summaries should use original wording rather than reproducing external articles.

## Profile and public resume

Edit `content/profile.json` to update biographies, experience, technical strengths, education, the timeline, and proposed speaking topics. The HTML resume, public PDF, Markdown resume, and identity data share this source. Proposed topics must remain clearly distinguished from previously delivered talks.

Contact is through LinkedIn and X only. No public email address or phone number is permitted in the pages, downloads, structured data, scripts, or generated text. The public resume is regenerated from the approved profile data, rather than visually redacting the original PDF. This prevents hidden text and metadata from revealing contact information.

The original resume under the workspace's `docs` directory is private source material. Keep it outside the site checkout and deployment archive. Do not copy it to `public`, add it to a public repository, or configure the server to serve the workspace root.

## Publishing outputs

`scripts/generate-public.mjs` runs before the framework build. It generates:

- Markdown alternatives for every work and collection, plus `/index.md`, `/about.md`, and `/resume.md`.
- `/llms.txt` and `/profile.json` from the same records as the website.
- `/sitemap.xml`, `/feed.xml`, and `/robots.txt`.
- `/Richard-Everts-Resume.pdf`, `/social.svg`, and a 1200 × 630 `/social.png` sharing image suitable for Open Graph previews.

Run the generator again after changing source content. It is normally invoked through the build command. Do not maintain generated outputs manually. The HTML pages, original source citations, and clear identity remain the foundation for discovery; auxiliary AI-readable files do not guarantee indexing or inclusion in model answers.

## Railway and Cloudflare

The deployable artifact is `dist/client`. Keep the application source directory as Railway's project root; when deploying from the parent workspace, upload `site` with `--path-as-root`. Use Railpack's Node.js build, Node.js 24, `npm run build`, and `npm start`. Set service root to `/site` for the GitHub repository, healthcheck `/`, `PORT=8080`, and `RAILPACK_BUILD_APT_PACKAGES=poppler-utils`. Configure these settings directly in Railway; legacy railway.toml/railway.json configuration is deprecated. The start command uses (the static-output server in `scripts/serve.mjs`). Do not enable Railpack's alternate native static server: the application server owns canonical and legacy redirects and true 404 responses. It binds to `0.0.0.0` and Railway's `PORT` by default; `HOST`, `--host`, and `--port` override these for local work. No database, runtime secret, model API, or account system is needed.

Verify the Railway-generated URL before changing DNS. Attach `richeverts.com` and `www.richeverts.com` to the intended service, apply the exact routing and ownership records returned by Railway in Cloudflare, and check both domain verification and HTTPS. Configure the hosting layer to redirect `www` to the canonical apex while preserving the path and query. Keep the same redirects when changing static hosts. Preserve the known historical `/february-and-march-lancaster-ai-meetup-fun/` link by redirecting it to `/speaking`.

Build validation should complete before deployment. Confirm the specific Railway deployment reaches `SUCCESS`; an upload or queued deployment is insufficient. Check the live homepage, a deep work URL, resume PDF, Markdown alternative, sitemap, and a nonexistent path. Check canonical redirects and ensure the original resume path returns 404.

For Git-based automatic deployments, connect the private source repository to the intended Railway service and production branch. Commit content changes and review the generated checks before pushing. Avoid connecting unrelated existing Railway services or changing their settings.

To roll back, select the previous successful deployment in Railway's deployment history and redeploy that artifact. Verify its terminal state and public routes. Source rollback can then be made with an ordinary revert commit; do not rewrite shared Git history.

## Release checks

The static verifier checks rendered routes, titles, descriptions, canonical URLs, headings, JSON-LD syntax, internal links and fragments, source records, generated publishing formats, and contact privacy. It extracts text from the public PDF and checks its metadata. Browser QA should additionally cover mobile layouts, keyboard navigation, archive searching and filters, reduced motion, video loading, resume download, and the social links. Verify substantive page content remains available with JavaScript disabled.

Review external recording and source availability when updating the archive. Keep a record's source and publication status accurate if an external service changes or a research direction is archived.
