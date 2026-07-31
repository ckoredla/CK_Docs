# Northbound Labs

A practical technical publication focused on airline maintenance, enterprise AI modernization, AWS architecture, and resilient distributed systems.

Content is drafted through pull requests and published only after editorial approval.

## Publication architecture

`content/articles.json` is the central registry for publication identity, dates, archive placement, discovery metadata, diagrams, references, related reading, and sequential navigation. `issueDate` is the historical issue month; `publishedAt` is the actual release timestamp. Sitemap, RSS, search records, homepage cards, archive navigation, and article navigation are derived from this registry.

Article routes use the reusable publication shell and primitives in `app/components/Publication.tsx`. New articles must have a route, references, an original diagram, valid registry links, canonical/Open Graph metadata, and Article structured data whose `datePublished` is `publishedAt`.

## Local development and quality

```sh
npm install
npm run dev
npm run check
```

The full check runs deterministic linting, TypeScript checks, archive validation, and the production build. The same command runs in GitHub Actions. Individual commands are `npm run lint`, `npm run typecheck`, `npm test`, `npm run validate`, and `npm run build`.

Machine-readable publication endpoints:

- `/sitemap.xml`
- `/robots.txt`
- `/feed.xml`
- `/search-index.json`
