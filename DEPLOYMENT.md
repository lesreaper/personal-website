# Production deployment

Source: https://github.com/lesreaper/personal-website

Live site: https://richeverts.com

Railway dashboard: https://railway.com/project/3dc7d116-aece-43fd-804f-aa135d6eae08/service/4f060a2b-f005-4362-9ac8-7439bc1ec938?environmentId=6141e669-90a4-4d0f-8c95-fcd6fd89c676

Railway builds the `/site` directory with Node.js 24. `npm run build` generates the publication files, exports static HTML, and verifies the artifacts. The service runs `npm start` on port 8080. The apex domain serves the public site and the www domain permanently redirects paths and queries to the apex.

## Release checks

Run `npm run check` and `npm run build` from `site/`. Once the build finishes, run `node --test scripts/serve.test.mjs`. Start the static server with `node scripts/serve.mjs --host 127.0.0.1 --port 4173` and run `npm run test:browser` against it. Browser evidence is written to the ignored `site/outputs/` directory.

Verify the homepage, the declaration and its Markdown edition, `/timeline`, `/research`, `/archive`, `/llms.txt`, `/profile.json`, and `/sitemap.xml` on the released domain. The build checks the source transcription, all canonical routes, internal links, JSON-LD, and machine-readable publication records. The original private résumé stays outside the build. Its retired public URLs return HTTP 410.

## Branches and environments

- `main` automatically deploys to Railway `production` (`6141e669-90a4-4d0f-8c95-fcd6fd89c676`).
- `dev` automatically deploys to Railway `development` (`adfb0caf-2368-48ca-9b5a-d21ee7334fab`).
- Development uses `SITE_ENVIRONMENT=development` to send `X-Robots-Tag: noindex, nofollow, noarchive` and a disallow-all robots.txt. Production remains crawlable.
- Make changes on `dev`, review the development deployment, then merge `dev` into `main` to release.

Development preview: https://richard-everts-development.up.railway.app

After a build, run `node --test site/scripts/serve.test.mjs` from the repository root to verify environment indexing and canonical redirects.
