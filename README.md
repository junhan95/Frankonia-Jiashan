# Frankonia Jiashan

Based on the Frankona-Korea Next.js website, retaining its design, product catalogue, images, downloads, English copy and enquiry features.

## Languages

| Language | Route | HTML language |
| --- | --- | --- |
| Simplified Chinese (default) | `/` | `zh-CN` |
| English | `/en/` | `en` |

The language switch keeps the current page. Canonical URLs, language alternates, structured data and sitemap follow the same routing. Chinese copy lives under the `zh` key beside the original `en` copy in `app/`.

## Development

Requires Node.js 22.13 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:3000 for Chinese or http://localhost:3000/en/ for English.

```sh
npm run lint
npm test
```

Tests build the static export, validate pages and links, and exercise the original MyChamber decision matrix in both languages.

## GitHub Pages

Repository: https://github.com/junhan95/Frankonia-Jiashan

```sh
npm run build:static
```

The export is written to `out/`, using `/Frankonia-Jiashan` as the base path and `https://junhan95.github.io` as the origin. The GitHub Actions workflow builds, validates and deploys on pushes to `main`, when GitHub Pages is configured to use GitHub Actions. Staging pages are marked `noindex`.

For a domain-root deployment, set the variables in `.env.example` and build with `STATIC_EXPORT=1`. Confirm the production origin before enabling indexing.

## Content and enquiries

Sales and quotation enquiries go to `sales@emc-frankonia.com`. MyChamber keeps `sales@frankoniagroup.com` in copy. The footer displays the Jiashan office address and telephone; the contact page lists Jiashan, Heideck, Forchheim, Chennai and Korea in that order. Enquiry buttons open the visitor's mail application; the website itself does not send mail. My Enquiry uses a Jiashan-specific browser storage key.

Chinese translations are stored in source and require no translation service at runtime. Fonts are downloaded at build time and served locally. English product names, model identifiers, standards and downloadable source documents remain in their original form. Technical Chinese wording should receive a native-language editorial review before public launch.
