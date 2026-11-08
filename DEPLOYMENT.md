# Production deployment

Source: https://github.com/lesreaper/personal-website

Live site: https://richard-everts-production.up.railway.app

Railway dashboard: https://railway.com/project/3dc7d116-aece-43fd-804f-aa135d6eae08/service/4f060a2b-f005-4362-9ac8-7439bc1ec938?environmentId=6141e669-90a4-4d0f-8c95-fcd6fd89c676

Railway follows `main` and builds the `/site` directory. The verified deployment is `0586d223-1924-4e63-a5d5-beb02195ce68` (SUCCESS). `npm run build` renders and verifies all 35 pages, 28 source-backed entries, machine-readable files, and the public resume. Build dependencies include `RAILPACK_BUILD_APT_PACKAGES=poppler-utils`; `PORT=8080` matches the public domains.

## Remaining Cloudflare setup

The custom domains are attached to Railway but await DNS ownership verification and certificates. Cloudflare DNS was not accessible from the implementation session. Add the following records in the `richeverts.com` zone. Set CNAME records to **DNS only** during verification, and use the default TTL.

| Type | Name in Cloudflare | Value |
| --- | --- | --- |
| CNAME | @ | `272xgth1.up.railway.app` |
| TXT | _railway-verify | `railway-verify=ad8aaa9efdda710637dc875e585f503a289cda4ac0532975f4f498f59ee5ae58` |
| CNAME | www | `gv45jfgi.up.railway.app` |
| TXT | _railway-verify.www | `railway-verify=9f1633b92b6263ae2479dc1b392f4f432f36777e41a61a2be39288cc3005037b` |

Replace only conflicting website A/AAAA/CNAME records. Leave unrelated DNS records in place. After Railway verifies both domains and issues certificates, verify apex HTTPS and the permanent www-to-apex redirect with paths and query strings preserved. Railway automatically checks the ownership TXT records; if verification expires after 72 hours, correct DNS and retry the certificate in Railway.

## Release evidence

- TypeScript and complete local/cloud static release checks passed.
- All 35 routes rendered without mobile horizontal overflow at 390px.
- Ten representative desktop/mobile accessibility audits reported no serious or critical violations.
- Browser flows passed for navigation, archive search/filters, animation pause, reduced motion, video activation, PDF download, and reading without JavaScript.
- Local mobile Lighthouse: performance 96, accessibility 100, largest contentful paint 1.2 seconds, cumulative layout shift 0.
- Live HTTP smoke passed for public pages, PDF, Markdown, JSON, sitemap, social image, and private-file 404 boundaries.
- Live browser smoke passed for images/fonts, research search, mobile navigation, and absence of JavaScript errors.
- Only LinkedIn and X are published as contact channels. The original source resume is excluded from Git and deployment.

Evidence files and screenshots are local under `site/outputs/` and are deliberately not committed.

## Branches and environments

- `main` automatically deploys to Railway `production` (`6141e669-90a4-4d0f-8c95-fcd6fd89c676`).
- `dev` automatically deploys to Railway `development` (`adfb0caf-2368-48ca-9b5a-d21ee7334fab`).
- Development uses `SITE_ENVIRONMENT=development` to send `X-Robots-Tag: noindex, nofollow, noarchive` and a disallow-all robots.txt. Production remains crawlable.
- Make changes on `dev`, review the development deployment, then merge `dev` into `main` to release.
