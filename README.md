# Richard Everts — personal website

Research, engineering, film, writing, and speaking at richardeverts.com.

The application lives in `site/`. Private source documents in `docs/` are deliberately excluded from Git and deployment.

```sh
cd site
npm ci
npm run dev
```

Requires Node.js 24. Run `npm run check` and `npm run build` before a release. The local PDF privacy check uses Poppler (`pdftotext` and `pdfinfo`). See [the site guide](site/README.md) for content editing, sources, browser verification, Railway deployment, and rollback.
