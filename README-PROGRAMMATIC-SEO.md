# Programmatic SEO Pages (Additive System)

This system adds new SEO landing pages without changing existing product routes, UI components, or Neon DB schema.

## Files Added

- `data/programmatic-seo.json`
- `lib/programmatic-seo.ts`
- `app/(programmatic)/inspired-by/[slug]/page.tsx`
- `app/(programmatic)/alternatives-to/[slug]/page.tsx`
- `app/(programmatic)/best/[slug]/page.tsx`

## Existing Files Updated

- `app/sitemap.ts` (only added new programmatic URLs)

## Route Map

- `/inspired-by/[slug]`
- `/alternatives-to/[slug]`
- `/best/[slug]`

## Data Source Split

- SEO text + mapping metadata: `data/programmatic-seo.json`
- Real product data (price/images/availability): existing Neon-backed query helpers in `lib/db/products.ts`

## Product Mapping Rule

In `programmatic-seo.json`, each inspiration has:

```json
"humeProduct": { "slug": "creed-aventus" }
```

`slug` is mapped to your existing product route id (`/product/[id]`).

## How to Add a New Inspired Page

1. Add a new object in `programmatic-seo.json > inspirations`.
2. Set `humeProduct.slug` to an existing product id.
3. Deploy.

The page is automatically available at:

`/inspired-by/<your-slug>` and `/alternatives-to/<your-slug>`.

## How to Add a New Best Guide

1. Add a new object in `programmatic-seo.json > alternatives`.
2. Add existing product ids in `humeProducts`.
3. Deploy.

The page is automatically available at:

`/best/<your-slug>`.

## Sitemap

`app/sitemap.ts` now appends all programmatic URLs through:

`getProgrammaticSitemapEntries(baseUrl)`.

## Safety Notes

- No changes were made to Neon DB schema or tables.
- No existing product page routes were replaced.
- No existing UI components were redesigned.
- New pages reuse current design patterns and components.
