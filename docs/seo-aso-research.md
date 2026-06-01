# SEO & ASO Research: shabble.xyz

> **Project:** Shabble — Daily Shape Guessing Puzzle Game  
> **Domain:** https://shabble.xyz (redirects to https://shabble.vercel.app)  
> **Stack:** Next.js 15 (App Router), React 19, Tailwind CSS, Vercel (hosting)  
> **Date:** 2026-06-01

---

## 1. Current SEO State Analysis

### What exists today

| Aspect | Status | Details |
|---|---|---|
| **Meta title** | ✅ Basic | `"Shabble"` in root layout; `"Shabble"` in daily layout |
| **Meta description** | ⚠️ Weak | Root: `"Shabble is a shape guessing game"` — too short, no keywords. Daily: `"Shabble is a shape guessing puzzle game. Play daily to get a new shape to guess. Solve with as less attempts as possible."` — better but still lacks keywords |
| **Favicon** | ✅ Present | `/favicon.ico` |
| **Open Graph / Twitter Cards** | ❌ Missing | No `og:title`, `og:description`, `og:image`, `twitter:card`, etc. |
| **Structured data (JSON-LD)** | ❌ Missing | No schema.org markup |
| **Sitemap.xml** | ❌ Missing | No sitemap for search engines |
| **Robots.txt** | ❌ Missing | No directives for crawlers |
| **Canonical URLs** | ❌ Missing | Potential duplicate content risk |
| **Semantic HTML** | ⚠️ Partial | Uses `<main>`, `<aside>` with `aria-label`, but no `<article>`, `<section>` with headings |
| **Performance monitoring** | ✅ Good | Vercel Speed Insights + Analytics active |
| **Google AdSense** | ✅ Present | Integrated via env vars |
| **Responsive design** | ✅ Good | Tailwind CSS, mobile-first |
| **SSL / HTTPS** | ✅ Good | Vercel provides HTTPS |
| **Custom 404 / error pages** | ❌ Likely missing | Not found in repo |

### Key observations

1. **Vanilla metadata** — Title and description are generic and lack geo/language targeting, keyword richness, or calls-to-action.
2. **No social previews** — Sharing the link on Twitter/X, LinkedIn, Discord, or WhatsApp yields a bare (or missing) preview card.
3. **No sitemap** — Search engines must discover pages organically through links or manual submission.
4. **No robots.txt** — Cannot control crawl budget or block non-prod paths.
5. **No structured data** — LLMs and search engines cannot understand the page type (WebApplication, Game, etc.).
6. **Redirect chain** — `shabble.xyz` → `shabble.vercel.app` → `/daily`. The custom domain is not the canonical host in metadata.

---

## 2. On-Page SEO Recommendations

### 2.1 Meta Tags (High Priority)

**Root layout (`app/layout.tsx`)** — strengthen with a richer, keyword-dense title and description:

```ts
export const metadata: Metadata = {
  title: {
    default: "Shabble — Daily Shape Guessing Puzzle Game",
    template: "%s | Shabble",
  },
  description:
    "Shabble is a free daily shape guessing puzzle game. Guess the hidden geometric shape in as few attempts as possible. New puzzle every day. Play online now!",
  keywords: [
    "shape guessing game", "daily puzzle", "brain game", "geometry puzzle",
    "shabble", "free online puzzle", "daily challenge",
  ],
  authors: [{ name: "Shabble" }],
  robots: { index: true, follow: true },
};
```

**Daily layout (`app/daily/layout.tsx`)** — keep the page-specific description, add canonical URL:

```ts
export const metadata: Metadata = {
  title: "Daily Puzzle",
  description:
    "Play today's Shabble daily shape guessing puzzle. Guess the hidden shape and challenge your friends. Free daily puzzle game.",
  alternates: { canonical: "https://shabble.xyz/daily" },
};
```

### 2.2 Open Graph & Twitter Cards (High Priority)

Add to `app/layout.tsx`:

```ts
export const metadata: Metadata = {
  // ...title, description, etc.
  openGraph: {
    title: "Shabble — Daily Shape Guessing Puzzle Game",
    description:
      "Guess the hidden shape in as few attempts as possible. New puzzle every day!",
    url: "https://shabble.xyz",
    siteName: "Shabble",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",  // Generate a 1200×630 PNG
        width: 1200,
        height: 630,
        alt: "Shabble — Daily Shape Guessing Puzzle Game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shabble — Daily Shape Guessing Puzzle Game",
    description:
      "Guess the hidden shape in as few attempts as possible. New puzzle every day!",
    images: ["/og-image.png"],
  },
};
```

**Action:** Create a custom `public/og-image.png` (1200×630) with the game logo/visual.

### 2.3 Structured Data / JSON-LD (High Priority — also critical for ASO)

Add to `app/daily/layout.tsx` (or a dedicated script component):

```ts
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Shabble",
  url: "https://shabble.xyz",
  description:
    "Shabble is a free daily shape guessing puzzle game. Guess the hidden geometric shape in as few attempts as possible.",
  applicationCategory: "GameApplication",
  operatingSystem: "All",
  browserRequirements: "Requires JavaScript",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Organization",
    name: "Shabble",
  },
};
```

Embed using a `<script type="application/ld+json">` tag or Next.js `<Script>` with `dangerouslySetInnerHTML`.

Also add a `BreadcrumbList` schema for the `/daily` page.

### 2.4 Sitemap.xml (High Priority)

Create `app/sitemap.ts`:

```ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://shabble.xyz",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://shabble.xyz/daily",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];
}
```

Next.js 15 automatically emits `sitemap.xml` at build time from this file.

### 2.5 Robots.txt (Medium Priority)

Create `app/robots.ts`:

```ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: "https://shabble.xyz/sitemap.xml",
  };
}
```

---

## 3. Technical SEO Recommendations

### 3.1 Performance & Core Web Vitals (Medium Priority)

| Metric | Current State | Recommendation |
|---|---|---|
| **LCP** | Unknown — not measured publicly | Optimize the hero image/board render; use `<Image>` with `priority` on the game board |
| **FID / INP** | Unknown | Minimize main-thread work from AdSense scripts; lazy-load non-critical JS |
| **CLS** | Unknown | Ensure ad slots have explicit dimensions to prevent layout shifts |
| **TTFB** | Likely good (Vercel Edge) | Already on Vercel — ensure server components are used for static content |

**Specific actions:**

- Add explicit `width`/`height` to all ad unit containers to prevent CLS.
- Use `next/dynamic` with `ssr: false` for the confetti library (`canvas-confetti`) which is likely only used post-win.
- Ensure `react-toastify` CSS is tree-shaken or only loaded on interaction.
- Audit bundle with `next build` + `@next/bundle-analyzer`.

### 3.2 SSR / SSG Improvements (Low Priority)

- The daily puzzle page is already a Server Component by default in Next.js 15 App Router — this is good.
- Consider `generateStaticParams` if multiple puzzle pages are ever added.
- The API routes (`/api/new-user`, `/api/game-status`, etc.) should remain dynamic.

### 3.3 Mobile SEO (Low Priority)

- Site is already responsive (Tailwind CSS) — verified in the code.
- Ensure `viewport` meta tag is properly set (Next.js sets this automatically).
- Confirm ad placements don't push content below the fold on mobile.

### 3.4 Crawl Budget (Low Priority)

- Only 2 indexable pages currently — crawl budget is not a concern.
- Once more pages are added (archive, blog, leaderboard), use the sitemap and `robots.txt` to guide crawlers.

---

## 4. ASO — AI Search Optimization (LLM / RAG Discovery)

### 4.1 Why ASO matters for shabble.xyz

LLM-based search engines (ChatGPT Search, Perplexity, Google AI Overviews, Bing Copilot) rely on crawling and indexing content to surface in answers. 60%+ of traffic from the USA suggests strong potential — optimizing for AI retrieval can multiply organic discovery.

### 4.2 Principles for LLM / RAG discoverability

1. **Clean, semantic HTML** — LLM-friendly crawlers parse HTML structure. Use landmarks (`<header>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`) with clear heading hierarchy (`<h1>` → `<h6>`).
2. **Structured data (JSON-LD)** — Schema.org markup is the single highest-impact signal for AI systems. It provides explicit entity descriptions.
3. **Clear content hierarchy** — The first ~100 words of visible text should answer "What is this?" Include the game name, core mechanic, and unique value proposition.
4. **Natural language coverage** — Include phrases that real users / LLM queries use: *"free daily puzzle game"*, *"guess the shape"*, *"brain training"*, *"geometry puzzle"*.
5. **Authoritative external signals** — If possible, get listed on puzzle/game directories. LLM training data favors sites with inbound topical links.
6. **Fast load + mobile-friendly** — AI crawlers increasingly consider page experience signals.

### 4.3 Concrete ASO actions (All High Priority for AI discovery)

| # | Action | Impact |
|---|---|---|
| 1 | **Add JSON-LD for `WebApplication` + `Game`** | Highest — directly tells AI what this is |
| 2 | **Improve meta description to be a concise, keyword-rich summary** | Used in snippets and AI answer extraction |
| 3 | **Add a clear `<h1>` on the daily page with the game name** | Currently the page may lack a prominent H1 |
| 4 | **Add a visible "About" section with 50–100 words describing the game** | Gives LLMs a reliable text passage to extract |
| 5 | **Use semantic HTML5 tags throughout** | Helps crawlers understand page structure |
| 6 | **Add FAQ schema for common questions** (e.g., "How to play Shabble?", "What is the daily shape puzzle?") | LLMs often pull from FAQ schemas for answers |
| 7 | **Ensure `shabble.xyz` is the canonical domain** | Prevents split signals between `.xyz` and `.vercel.app` |

### 4.4 Suggested "About" blurb (to add on the page)

> **Shabble** is a free daily shape guessing puzzle game. Each day, a new geometric shape is hidden. Your goal is to guess the shape by selecting tiles — the game tells you how many you got right. With unlimited attempts, you can solve the puzzle at your own pace. Challenge your friends and see who can guess the shape in the fewest tries. Play Shabble online now, no download required.

Place this in the `/daily` page or as a collapsible `<section>` at the bottom of the page.

---

## 5. Concrete Action Items

| # | Task | File(s) | Effort | Priority |
|---|---|---|---|---|
| 1 | **Strengthen root layout metadata** (title template, keywords, robots) | `app/layout.tsx` | Low | 🔴 High |
| 2 | **Add Open Graph & Twitter Card metadata** | `app/layout.tsx` | Low | 🔴 High |
| 3 | **Create `og-image.png` (1200×630)** | `public/og-image.png` | Medium | 🔴 High |
| 4 | **Add JSON-LD structured data (WebApplication + Game)** | `app/daily/layout.tsx` | Low | 🔴 High |
| 5 | **Create sitemap.xml** | `app/sitemap.ts` | Low | 🔴 High |
| 6 | **Create robots.txt** | `app/robots.ts` | Low | 🟡 Medium |
| 7 | **Add canonical URL alternates** | `app/daily/layout.tsx` | Low | 🔴 High |
| 8 | **Ensure semantic `<h1>` on daily page** | `app/daily/page.tsx` or component | Low | 🔴 High |
| 9 | **Add an "About Shabble" section with keyword-rich description** | Component in daily layout | Medium | 🔴 High |
| 10 | **Add FAQ schema (JSON-LD)** | `app/daily/layout.tsx` | Medium | 🟡 Medium |
| 11 | **Add explicit dimensions to ad containers** | `src/components/adsense/*` | Low | 🟡 Medium |
| 12 | **Lazy-load canvas-confetti with `next/dynamic`** | Daily component | Low | 🟢 Low |
| 13 | **Fix redirect: serve from custom domain as canonical** | Vercel project settings + `next.config.ts` | Medium | 🔴 High |
| 14 | **Add a 404 page** | `app/not-found.tsx` | Low | 🟢 Low |
| 15 | **Set up Google Search Console & Bing Webmaster Tools** | External | Low | 🔴 High |

### Effort Legend
- **🟢 Low** — < 30 min, isolated change
- **🟡 Medium** — 1–2 hours, may involve design or config
- **🔴 High** — Several hours, cross-domain or requires assets

---

## 6. Priority Recommendations

### Immediate (this week) — Maximum SEO/ASO impact for minimal effort
1. ✅ Strengthen meta tags (title, description, keywords)
2. ✅ Add Open Graph + Twitter Card metadata
3. ✅ Add JSON-LD structured data (WebApplication)
4. ✅ Create sitemap.xml and robots.txt
5. ✅ Add canonical URL
6. ✅ Ensure a clear `<h1>` with game name on the page
7. ✅ Add an "About" section with keyword-rich, natural language description
8. ✅ Submit domain to Google Search Console and Bing Webmaster Tools

### Short-term (next 2 weeks)
9.  Create and deploy `public/og-image.png`
10. Add FAQ schema
11. Add explicit dimensions to ad containers to prevent CLS

### Medium-term (next month)
12. Lazy-load non-critical JS (canvas-confetti, react-toastify)
13. Set up the Vercel custom domain so `shabble.xyz` is the primary host
14. Build a simple leaderboard or archive page (adds indexable content)
15. Monitor Core Web Vitals in Speed Insights and iterate

---

## 7. Measuring Success

| Metric | Tool | Current Baseline | Target |
|---|---|---|---|
| Pages indexed | Google Search Console | TBD | All pages indexed |
| Organic impressions | GSC / Bing WT | TBD | +100% in 3 months |
| CTR from search | GSC | TBD | >3% |
| LLM citation count | Manual Perplexity/ChatGPT Search queries | TBD | Appear in top-5 results |
| Core Web Vitals pass rate | Speed Insights / PageSpeed Insights | TBD | All 3 metrics "Good" |
| Social share preview | Twitter Card Validator / LinkedIn Post Inspector | Broken | Correct preview |

---

*Document generated from codebase audit of shabble.xyz on 2026-06-01.*
