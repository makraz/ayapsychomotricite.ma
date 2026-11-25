# SEO / GEO / AEO audit: ayapsychomotricite.ma

Audit date: 2026-11-25. Scope: `public/index.html`, `public/404.html`, `public/robots.txt`, `public/sitemap.xml`, `Aya Psychomotricite - Site.html`, the live responses from `https://ayapsychomotricite.ma`, and git history up to `149c928`. No site files were changed.

Line references: `public/index.html:N` is a physical line. The page body is a JSON-encoded string on `public/index.html:409`. References written `tpl:N` point to line N of that string after decoding (it starts with `<!DOCTYPE html>` and is 869 lines long).

## Summary

The page looks complete in a browser, but crawlers barely see it.

1. **Google can see almost none of the body text.** `public/index.html` is a design-tool "bundler" export (4,491,142 bytes). The visible page is stored in a JSON string (`<script type="__bundler/template">`) that starts at **byte 4,409,990**. JavaScript unpacks it after a 4.38 MB base64 asset manifest (`public/index.html:397`). Googlebot "crawls the first 2MB" of an HTML file, the limit "is applied on the uncompressed data", and "only sends the already downloaded part of the file for indexing consideration" ([Googlebot](https://developers.google.com/search/docs/crawling-indexing/googlebot)). So Google receives the static `<head>` (title, description, canonical, OG, JSON-LD: all within the first 5 KB) plus a cut-off manifest. It never receives the template or the runtime. When it renders, the unpacker should hit `JSON.parse` on a cut-off manifest, or find no template, and stop with an error. *Unverified*: this is what the code and the documented limit imply. I could not see Google's own render. Confirm with Search Console URL Inspection, under "View crawled page" then "HTML".
2. **AI crawlers see no body text either.** "Not all bots can run JavaScript" ([Google JS SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)). Without JS, the body is an SVG letter "A", the text "Unpacking...", and a `<noscript>` that says "This page requires JavaScript to display." (`public/index.html:35-50`).
3. **Arabic is invisible to every crawler.** FR and AR share one URL. The switch is a React state toggle (`tpl:442`, `tpl:815-822`). Even with JS, only the FR branch renders by default. Google "recommends using different URLs for each language version" ([multi-regional sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)).
4. **The live robots.txt is not the repo's file.** Cloudflare puts its managed block in front of it. That block disallows GPTBot, ClaudeBot, Google-Extended and others. Separately, a request with a PerplexityBot user-agent got **HTTP 403**.
5. **Several JSON-LD properties are invalid or off-guideline.** `availableLanguage` and `medicalSpecialty` are used outside their schema.org domains. `aggregateRating` copies Google ratings, and Google says "Don't aggregate reviews or ratings from other websites".
6. **FAQ rich results no longer exist.** The brief says FAQ rich results are limited to government and health sites since 2023. That was true from 2023-08-08 ([blog](https://developers.google.com/search/blog/2023/08/howto-faq-changes)). Google has since deprecated the feature entirely: "This feature will no longer appear in Google Search starting May 7, 2026", and the docs were removed on 2026-06-15 ([Search Central updates](https://developers.google.com/search/updates)). For AEO, the value now lies in FAQ text that crawlers can read, not in `FAQPage` markup.

The single highest-leverage change is to ship the page as plain static HTML: one URL per language, with images and fonts as separate files. Most other items depend on it.

## Prioritized changes

| # | Priority | Area | Issue | File:line | Suggested change | Source |
|---|---|---|---|---|---|---|
| 1 | P0 | SEO/GEO/AEO | Body content starts at byte 4.41 MB, beyond Googlebot's 2 MB fetch limit, and exists only inside a JS-decoded JSON string | `public/index.html:396-410` | Ship pre-rendered static HTML with assets as separate files (§1) | [Googlebot](https://developers.google.com/search/docs/crawling-indexing/googlebot), [JS SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) |
| 2 | P0 | SEO/GEO | Arabic version has no URL and is never rendered for crawlers | `tpl:428`, `tpl:621`, `tpl:815-822` | Add `/ar/` with `lang="ar" dir="rtl"`, plus reciprocal hreflang and x-default (§2) | [multi-regional](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites), [hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions) |
| 3 | P1 | GEO | Cloudflare-managed robots.txt overrides the repo file. PerplexityBot UA gets 403 | live `/robots.txt`; `public/robots.txt:1-4` | Choose a policy per bot in the Cloudflare dashboard (not the repo). Allow the search bots: OAI-SearchBot, Claude-SearchBot, Claude-User, PerplexityBot (§3) | [Cloudflare managed robots](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/), [OpenAI bots](https://developers.openai.com/api/docs/bots), [Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), [Perplexity](https://docs.perplexity.ai/guides/bots) |
| 4 | P1 | SEO | `www.` serves 200 with identical content (no redirect) | Cloudflare config | Add a Cloudflare Bulk Redirect from www to apex (301) | [Pages redirects](https://developers.cloudflare.com/pages/configuration/redirects/) |
| 5 | P1 | SEO/GEO | JSON-LD: `availableLanguage` and `medicalSpecialty` are out of domain on MedicalBusiness. "Physiotherapy" is semantically wrong. `aggregateRating` is aggregated from Google | `public/index.html:26`, `tpl:37` | Replace with the `@graph` in §4 | [schema.org availableLanguage](https://schema.org/availableLanguage), [medicalSpecialty](https://schema.org/medicalSpecialty), [review snippet](https://developers.google.com/search/docs/appearance/structured-data/review-snippet), [LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business) |
| 6 | P1 | AEO/GEO | FAQ exists (7 Q&A per language) but crawlers cannot read it. FAQ rich results are gone | `tpl:572-585`, `tpl:846-863` | Render the FAQ as static HTML with direct first-sentence answers. Add a few query-shaped questions. `FAQPage` markup is optional and has no Google rich-result benefit (§5) | [FAQ deprecation](https://developers.google.com/search/updates), [AI features](https://developers.google.com/search/docs/appearance/ai-features) |
| 7 | P1 | SEO/GEO (E-E-A-T) | No diploma, school, year or professional registration anywhere on the page or in markup | `tpl:518-531` | Add a short "Parcours / Formation" block and `hasCredential` (client must supply the facts) (§6) | [helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [Person](https://schema.org/Person), [EducationalOccupationalCredential](https://schema.org/EducationalOccupationalCredential) |
| 8 | P2 | SEO | Two different meta descriptions: static 256 chars (`:7`) and rendered 199 chars (`tpl:14`). The OG descriptions also differ | `public/index.html:7,14`; `tpl:14,18` | One description per language, from one source (§7) | [snippet](https://developers.google.com/search/docs/appearance/snippet) |
| 9 | P2 | Perf | 1.54 MB 1024×1024 PNG logo shown at ≤230 px. Photo gallery is PNG. Cyrillic/Vietnamese font subsets shipped. All of it base64 in uncacheable HTML (`cache-control: max-age=0`) | `public/index.html:397`; `tpl:39-417`, `tpl:461` | Logo to ~460 px WebP/PNG. Photos to WebP/AVIF with `width`/`height`. Keep latin + arabic subsets only. Serve as cacheable files (§8) | measured from file; [Googlebot](https://developers.google.com/search/docs/crawling-indexing/googlebot) (resources fetched separately) |
| 10 | P2 | GEO/local | NAP and GBP name consistency not verifiable from here | `tpl:594`, `tpl:786`, JSON-LD | Check the GBP name, address and phones match the site exactly. Link the GBP from `sameAs` if a stable URL exists (§9) | [GBP guidelines](https://support.google.com/business/answer/3038177) |
| 11 | P3 | SEO | Sitemap has one URL. `changefreq`/`priority` are ignored | `public/sitemap.xml:1-9` | Add `/ar/` with `xhtml:link` alternates. Drop `changefreq`/`priority` (§2) | [build sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) |
| 12 | P3 | GEO | No `/llms.txt` | n/a | Optional. Cheap to add, but it is an informal proposal and Google says it is not needed (§10) | [llmstxt.org](https://llmstxt.org/), [AI features](https://developers.google.com/search/docs/appearance/ai-features) |
| 13 | P3 | SEO/a11y | Generic or duplicate alt text ("Le cabinet" and "Salle de consultation" on different photos). Arabic block has `dir` but no `lang` | `tpl:519`, `tpl:539-544`, `tpl:622`; `public/404.html:35` | More descriptive alts. Add `lang="ar"` to Arabic fragments (§11) | [Google Images](https://developers.google.com/search/docs/appearance/google-images) *(not fetched in this audit)* |
| 14 | P3 | Hygiene | `Aya Psychomotricite - Site.html` at repo root is the stale design-tool source export. It is not deployed (live URL returns 404) | repo root | Move to `design/` or delete. Never copy it into `public/` (§12) | live check |
| OK | n/a | SEO | 404 page returns HTTP 404 and has `noindex, follow` | `public/404.html:7` | No change needed | live check |
| OK | n/a | SEO | Canonical, OG, Twitter card, `og:image` 1200×630 (file verified), `http`→`https` 301 | `public/index.html:8-25` | Keep. Update when URLs split per language | live check |

## Detail

### 1. Make the content crawlable (P0)

**What the file is.** `public/index.html` is a self-unpacking bundle. Its parts:

- static `<head>` (`:1-41`)
- an unpacker script (`:52-393`)
- `__bundler/manifest` (`:396-398`): 35 base64 assets, 4.38 MB
- `ext_resources` (`:400-402`)
- `__bundler/template` (`:408-410`): the real page, as a JSON string

On `DOMContentLoaded` it decodes every asset, then calls `document.documentElement.replaceWith(...)` (`:331`). That throws away the static head and loads the "DC" runtime and React from the manifest, which then render the page. The runtime's helmet manager copies the template's own `<title>`/`<meta>`/JSON-LD into the new `<head>` (decoded runtime, `src/helmet.ts`).

**What each consumer gets.**

| Consumer | What it receives |
|---|---|
| Browser | Full FR page after unpacking. AR only after a click |
| Googlebot | First 2 MB: static head, unpacker, part of the manifest. The template and runtime are past the cut. The render should fail. *Confirm with URL Inspection.* |
| GPTBot / OAI-SearchBot / ClaudeBot / PerplexityBot etc. | The raw HTML. With no JS (Google notes "not all bots can run JavaScript"), they get head metadata only. Body text is just "Unpacking..." / "This page requires JavaScript to display." |

Cited: "Googlebot crawls the first 2MB of a supported file type" and "The file size limit is applied on the uncompressed data" ([Googlebot](https://developers.google.com/search/docs/crawling-indexing/googlebot)). "server-side or pre-rendering is still a great idea because it makes your website faster for users and crawlers" ([JS SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)).

**Recommended fix (option A).** Publish plain static HTML. The page uses no client logic beyond the language toggle, so nothing is lost. Target layout:

```
public/
  index.html          # FR, <html lang="fr">, all text inline
  ar/index.html       # AR, <html lang="ar" dir="rtl">
  img/logo.webp       # ~460px
  img/cabinet-*.webp  # 6 gallery photos + about photo
  fonts/*.woff2       # Cormorant Garamond + Jost (latin, latin-ext), Tajawal (arabic, latin)
  og-image.png, robots.txt, sitemap.xml, 404.html, llms.txt (optional)
```

The `<sc-for>` loops (`tpl:475`, `tpl:578`, `tpl:667`, `tpl:770`) expand from the arrays in `tpl:824-863`. The `{{ accent }}` placeholders become `#5f7a6b`. The language button becomes a link (`<a href="/ar/" hreflang="ar" lang="ar">العربية</a>`). `<details>`/`<summary>` for the FAQ already work without JS. The templated sections can be extracted with a small script. The HTML would be roughly 40–60 KB per language instead of 4.4 MB.

**Stopgap (option B), if a rebuild must wait.** Put the FR and AR text as static semantic HTML inside `<body>`, before the scripts. Remove the full-screen `#__bundler_thumbnail` overlay (`:43-49`) so the text is not hidden behind a `z-index:9999` layer. In browsers, `replaceWith` swaps it out after unpacking. Crawlers keep it. The content is identical, so this is not cloaking, but the page is still 4.4 MB and the AR text still has no URL of its own. Treat it as temporary.

### 2. Bilingual URLs, hreflang, sitemap (P0/P3)

Today there is one URL. `og:locale:alternate=ar_MA` (`:21`) claims an Arabic version that has no URL. `<html lang="fr">` stays `fr` even when the AR branch is shown (`tpl:2`, the toggle at `tpl:815-822` doesn't touch it).

Put this in the `<head>` of **both** pages. "Each language version must list itself as well as all other language versions" ([hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions)).

```html
<link rel="canonical" href="https://ayapsychomotricite.ma/">           <!-- on /ar/: https://ayapsychomotricite.ma/ar/ -->
<link rel="alternate" hreflang="fr" href="https://ayapsychomotricite.ma/">
<link rel="alternate" hreflang="ar" href="https://ayapsychomotricite.ma/ar/">
<link rel="alternate" hreflang="x-default" href="https://ayapsychomotricite.ma/">
```

Use `fr`/`ar` without a region unless country targeting is wanted. The codes are ISO 639-1, with optional ISO 3166-1 region (same source).

`public/sitemap.xml`. Google ignores `<priority>` and `<changefreq>`, and uses `<lastmod>` only if it is "consistently and verifiably" accurate ([build sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://ayapsychomotricite.ma/</loc>
    <lastmod>2026-07-25</lastmod>
    <xhtml:link rel="alternate" hreflang="fr" href="https://ayapsychomotricite.ma/"/>
    <xhtml:link rel="alternate" hreflang="ar" href="https://ayapsychomotricite.ma/ar/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://ayapsychomotricite.ma/"/>
  </url>
  <url>
    <loc>https://ayapsychomotricite.ma/ar/</loc>
    <lastmod>2026-07-25</lastmod>
    <xhtml:link rel="alternate" hreflang="fr" href="https://ayapsychomotricite.ma/"/>
    <xhtml:link rel="alternate" hreflang="ar" href="https://ayapsychomotricite.ma/ar/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://ayapsychomotricite.ma/"/>
  </url>
</urlset>
```

Proposed per-language head metadata. Google sets no description length limit ("There's no limit on how long a meta description can be"; snippets are truncated to device width), and asks for unique descriptions per page ([snippet](https://developers.google.com/search/docs/appearance/snippet)). Shorter descriptions keep the key facts in view:

```html
<!-- FR (/) -->
<title>Psychomotricienne à Marrakech — Aya Alaoui El Hadari</title>
<meta name="description" content="Cabinet de psychomotricité et graphothérapie à Marrakech : bilan psychomoteur, troubles Dys, TDA/H, TSA, stimulation précoce, prévention gériatrique. Bébés, enfants, adultes et seniors. Sur rendez-vous.">
<meta property="og:locale" content="fr_MA">
<meta property="og:locale:alternate" content="ar_MA">

<!-- AR (/ar/) -->
<title>أخصائية العلاج النفسي الحركي بمراكش — آية العلوي الحضري</title>
<meta name="description" content="عيادة العلاج النفسي الحركي ومعالجة الخط بمراكش: تقييم نفسي حركي، اضطرابات التعلم، فرط الحركة، طيف التوحد، التحفيز المبكر ومرافقة كبار السن. بموعد مسبق.">
<meta property="og:locale" content="ar_MA">
<meta property="og:locale:alternate" content="fr_MA">
```

The current FR title (59 chars, `:5`) is fine. The proposal leads with the occupation people search for. Treat it as an option, not a defect. The current static description (`:7`) is 256 chars and ends with the phone number, which will usually be truncated.

### 3. Robots.txt and AI crawler policy (P1)

**Observed.** `public/robots.txt` is 4 lines (`User-agent: * / Allow: /` + Sitemap). The **live** `/robots.txt` is 2,751 bytes. Cloudflare's managed block comes first. It contains `Content-Signal: search=yes,ai-train=no,use=reference` and `Disallow: /` for Amazonbot, Applebot-Extended, Bytespider, CCBot, **ClaudeBot**, Diffbot, **Google-Extended**, **GPTBot**, anthropic-ai, Claude-Web, meta-externalagent, GoogleOther and about 20 others. Cloudflare documents that it "will prepend our managed robots.txt before your existing robots.txt", and that managed content appears when a Search, Agent or Training policy is set to block ([Cloudflare](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/)).

HTTP test with spoofed user-agent strings, 2026-11-25:

| UA | Status |
|---|---|
| OAI-SearchBot | 200 |
| Claude-SearchBot | 200 |
| GPTBot | 403 |
| ClaudeBot | 403 |
| PerplexityBot | 403 |

So something beyond robots.txt (likely Cloudflare AI Crawl Control or "Block AI bots") blocks PerplexityBot even though robots.txt does not disallow it. *Unverified*: spoofed UAs from a non-bot IP may be treated differently from the real crawlers. Check the Cloudflare dashboard (AI Crawl Control / Security → Bots).

**What each token controls (primary sources):**

| Token | Purpose | Effect of blocking |
|---|---|---|
| GPTBot | OpenAI model training | "Each setting is independent". Does not affect ChatGPT search ([OpenAI](https://developers.openai.com/api/docs/bots)) |
| OAI-SearchBot | ChatGPT search | Must be allowed to appear in ChatGPT search answers (same) |
| ChatGPT-User | User-initiated fetches | "not used for crawling the web in an automatic fashion" (same) |
| ClaudeBot | Anthropic training | Excludes future content from training ([Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)) |
| Claude-SearchBot | Claude search index | Blocking "may reduce your site's visibility and accuracy in user search results" (same) |
| Claude-User | User-asked fetches | Blocking "may reduce your site's visibility for user-directed web search" (same) |
| PerplexityBot | Perplexity search results, "not used to gather content for training" | Blocking removes the site from Perplexity search ([Perplexity](https://docs.perplexity.ai/guides/bots)) |
| Perplexity-User | User-requested fetch | "generally ignores robots.txt rules" (same) |
| Google-Extended | Gemini training and grounding | "does not impact a site's inclusion in Google Search nor is it used as a ranking signal" ([Google crawlers](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers)). AI Overviews / AI Mode follow Googlebot's robots rules ([AI features](https://developers.google.com/search/docs/appearance/ai-features)) |

**Recommendation.** The current training opt-outs (GPTBot, ClaudeBot, Google-Extended) are a legitimate choice that the owner should make knowingly. They do not cost Google Search, AI Overviews or ChatGPT search visibility. One exception: Google-Extended also covers Gemini *grounding*, so blocking it may reduce citations in Gemini-app answers. For GEO, make sure the **search/retrieval** agents are allowed: OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User.

Make the change in **Cloudflare**, not the repo. Google merges groups with the same user-agent ("all the rules from the groups applicable to the specific user agent are combined internally into a single group"), and a specific group replaces `*` ([robots.txt spec](https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt)). Adding `User-agent: GPTBot / Allow: /` to `public/robots.txt` would therefore merge with Cloudflare's `Disallow: /` into a conflicting group, not override it.

If the managed block is turned off and the repo file becomes authoritative, a minimal explicit version:

```
# Search / answer engines: allowed
User-agent: *
Allow: /

# Model-training crawlers: opt out (owner's choice; does not affect Google Search, ChatGPT search, Claude search or Perplexity)
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: CCBot
Disallow: /

Sitemap: https://ayapsychomotricite.ma/sitemap.xml
```

### 4. JSON-LD (P1)

Problems in the current block (`public/index.html:26`, duplicated in `tpl:37`):

| Property | Problem | Source |
|---|---|---|
| `availableLanguage` | Domain is ContactPoint, Course, LodgingBusiness, ServiceChannel, TouristAttraction. Not valid on MedicalBusiness | [schema.org](https://schema.org/availableLanguage) |
| `medicalSpecialty: "Physiotherapy"` | Domain is Hospital, MedicalClinic, MedicalOrganization, Physician. MedicalBusiness descends from LocalBusiness, not MedicalOrganization ([MedicalBusiness](https://schema.org/MedicalBusiness)). Psychomotricity is also not physiotherapy, and MedicalSpecialty has no psychomotor value ([MedicalSpecialty](https://schema.org/MedicalSpecialty)) | [schema.org](https://schema.org/medicalSpecialty) |
| `aggregateRating` (5.0 / 150) | Copied from Google reviews. Google: "Don't aggregate reviews or ratings from other websites". `aggregateRating` on LocalBusiness is "only recommended for sites that capture reviews about other local businesses". The count also goes stale. Keep the visible text, drop the markup | [review snippet](https://developers.google.com/search/docs/appearance/structured-data/review-snippet), [LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business) |
| `logo` = og-image (1200×630 banner) | Use a square logo file | judgment |
| `telephone` array | Google: "the primary contact method". Give one, put the landline in `contactPoint` | [LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business) |
| `url` without trailing slash | Canonical is `https://ayapsychomotricite.ma/`. Match it | consistency |
| `geo` | 7 decimal places. Google requires ≥5. OK | same |

**Type choice.** Keep `MedicalBusiness`. Google: "Use the most specific LocalBusiness sub-type possible". None of the 26 schema.org subtypes (Physiotherapy, Pediatric, Geriatric, Psychiatric, …) describes psychomotricity accurately, so the generic parent is the honest choice. `MedicalClinic` is also a subtype and would allow `medicalSpecialty`, but it implies a multi-practitioner clinic. Not recommended.

Proposed replacement. Use a separate block per language page, with `inLanguage` and `description` translated on `/ar/`. Fields in `<<…>>` need facts from the client. Remove them rather than guess.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalBusiness",
      "@id": "https://ayapsychomotricite.ma/#cabinet",
      "name": "Cabinet de Psychomotricité Aya Alaoui El Hadari",
      "alternateName": "عيادة العلاج النفسي الحركي آية العلوي الحضري",
      "description": "Cabinet de psychomotricité et de graphothérapie à Marrakech : bilan psychomoteur, troubles Dys, TDA/H, TSA, stimulation précoce, préparation à l'accouchement et prévention gériatrique. Consultations sur rendez-vous.",
      "url": "https://ayapsychomotricite.ma/",
      "image": ["https://ayapsychomotricite.ma/og-image.png"],
      "logo": "https://ayapsychomotricite.ma/img/logo.png",
      "telephone": "+212601162806",
      "contactPoint": [{
        "@type": "ContactPoint",
        "contactType": "appointments",
        "telephone": "+212601162806",
        "availableLanguage": ["fr", "ar"]
      }, {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "telephone": "+212524201944",
        "availableLanguage": ["fr", "ar"]
      }],
      "priceRange": "$$",
      "currenciesAccepted": "MAD",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Capital Business Center, 44 angle rue El Azhari et rue Errouda, 4e étage, bureau 12",
        "addressLocality": "Marrakech",
        "addressRegion": "Marrakech-Safi",
        "postalCode": "40000",
        "addressCountry": "MA"
      },
      "geo": { "@type": "GeoCoordinates", "latitude": 31.6426985, "longitude": -8.0115894 },
      "hasMap": "https://maps.app.goo.gl/TF9iQaiUNM3mg8L3A",
      "areaServed": { "@type": "City", "name": "Marrakech" },
      "knowsLanguage": ["fr", "ar"],
      "knowsAbout": ["Psychomotricité", "Bilan psychomoteur", "Graphothérapie", "Dysgraphie", "Troubles Dys", "TDA/H", "Trouble du spectre de l'autisme", "Stimulation précoce", "Maladie d'Alzheimer", "Prévention des chutes"],
      "sameAs": [
        "https://www.instagram.com/ayapsychomotricite/",
        "https://www.facebook.com/ayapsychomotricite"
      ],
      "founder": { "@id": "https://ayapsychomotricite.ma/#aya" },
      "employee": { "@id": "https://ayapsychomotricite.ma/#aya" },
      "makesOffer": [
        {"@type":"Offer","itemOffered":{"@type":"Service","name":"Bilan psychomoteur"}},
        {"@type":"Offer","itemOffered":{"@type":"Service","name":"Rééducation psychomotrice"}},
        {"@type":"Offer","itemOffered":{"@type":"Service","name":"Graphothérapie — rééducation de l'écriture"}},
        {"@type":"Offer","itemOffered":{"@type":"Service","name":"Troubles Dys et troubles des apprentissages"}},
        {"@type":"Offer","itemOffered":{"@type":"Service","name":"TDA/H, TSA, IMC et trisomie"}},
        {"@type":"Offer","itemOffered":{"@type":"Service","name":"Stimulation précoce et prévention"}},
        {"@type":"Offer","itemOffered":{"@type":"Service","name":"Accompagnement parental"}},
        {"@type":"Offer","itemOffered":{"@type":"Service","name":"Préparation à l'accouchement"}},
        {"@type":"Offer","itemOffered":{"@type":"Service","name":"Prévention et accompagnement des maladies gériatriques"}}
      ]
    },
    {
      "@type": "Person",
      "@id": "https://ayapsychomotricite.ma/#aya",
      "name": "Aya Alaoui El Hadari",
      "alternateName": "آية العلوي الحضري",
      "jobTitle": "Psychomotricienne et graphothérapeute",
      "worksFor": { "@id": "https://ayapsychomotricite.ma/#cabinet" },
      "knowsLanguage": ["fr", "ar"],
      "knowsAbout": ["Psychomotricité", "Graphothérapie"],
      "hasCredential": [{
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "<<diplôme, ex. Diplôme de psychomotricien>>",
        "recognizedBy": { "@type": "Organization", "name": "<<établissement / organisme>>" }
      }],
      "alumniOf": { "@type": "EducationalOrganization", "name": "<<école>>" }
    },
    {
      "@type": "WebSite",
      "@id": "https://ayapsychomotricite.ma/#website",
      "url": "https://ayapsychomotricite.ma/",
      "name": "Cabinet de Psychomotricité Aya Alaoui El Hadari",
      "inLanguage": ["fr", "ar"],
      "publisher": { "@id": "https://ayapsychomotricite.ma/#cabinet" }
    }
  ]
}
</script>
```

Notes:

- `hasCredential` expects `Credential`. `EducationalOccupationalCredential` is a subtype ([schema.org](https://schema.org/EducationalOccupationalCredential)).
- `knowsAbout`, `knowsLanguage`, `areaServed`, `founder`, `employee` and `hasCredential` are all valid on MedicalBusiness via Organization ([MedicalBusiness](https://schema.org/MedicalBusiness)). The Person properties are confirmed on [Person](https://schema.org/Person).
- `ContactPoint.availableLanguage` is in-domain.
- `contactType` values are free text.
- Opening hours are deliberately omitted (`149c928`). `openingHoursSpecification` is only "recommended", not required ([LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business)), so omitting it is fine.
- *Unverified*: I did not run the snippet through Google's Rich Results Test or the schema.org validator. Do that after editing.

### 5. FAQ and answer-engine content (P1)

The FAQ is good and answer-shaped (`tpl:846-863`), but crawlers can't read it (§1). Once it is static:

- Keep `<details><summary>`. Put each question in the summary and make the first sentence of each answer a self-contained direct answer. Several already are ("Non, vous pouvez consulter directement.").
- Add questions people actually ask. Each needs only facts the client confirms. Do not invent prices or credentials.
  - « Quelle est la différence entre un psychomotricien et un kinésithérapeute ? » (also fixes the "Physiotherapy" confusion)
  - « Qu'est-ce que la graphothérapie et pour qui ? »
  - « À partir de quel âge consulter un psychomotricien ? »
  - « Quels signes doivent alerter chez l'enfant ? »
  - « Combien coûte un bilan psychomoteur ? » (only if the client wants prices published)
  - « Où se trouve le cabinet à Marrakech ? » (answer with the full address in text)
  - Mirror each one in Arabic on `/ar/`.
- `FAQPage` JSON-LD is still a valid schema.org type, but Google no longer shows FAQ rich results. It was limited to "well-known, authoritative government and health websites" from 2023-08-08 ([blog](https://developers.google.com/search/blog/2023/08/howto-faq-changes)), then deprecated from 2026-05-07 and documentation removed 2026-06-15 ([updates](https://developers.google.com/search/updates)). For AI Overviews, "There's also no special schema.org structured data that you need to add" ([AI features](https://developers.google.com/search/docs/appearance/ai-features)). Adding `FAQPage` is harmless and may help other parsers. Priority: optional, after the text is crawlable. If added, the markup must mirror the visible text exactly.

### 6. E-E-A-T signals (P1)

Health is a YMYL topic. Google's guidance: "our systems give even more weight to content that aligns with strong E-E-A-T". "Of these aspects, trust is most important". Make it "self-evident … who authored your content". Fabricated credentials are explicitly deceptive ([helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)).

Today the page states the occupation ("Psychomotricienne · Graphothérapeute") and the 5.0 / 150 Google reviews. It has no diploma, school, graduation year, years of practice, professional association or registration.

Suggested addition to the "À propos" section (`tpl:518-531`, AR `tpl:710-723`), filled only with client-supplied facts:

```html
<h3>Formation et parcours</h3>
<ul>
  <li>Diplôme de <<…>> — <<établissement, ville, année>></li>
  <li>Formation en graphothérapie — <<organisme, année>></li>
  <li><<n>> ans d'expérience auprès des enfants, adultes et personnes âgées</li>
  <li><<Membre de / inscrite à … (si applicable)>></li>
</ul>
```

Mirror the same facts in `Person.hasCredential` / `alumniOf` (§4). A real photo of the practitioner with a descriptive alt also helps the "who" question. That is optional and up to the client. *Unverified*: whether Morocco has a mandatory register for psychomotricians. I did not research Moroccan regulation.

### 7. Duplicate and inconsistent head metadata (P2)

The static head (`public/index.html:5-26`) and the template helmet (`tpl:12-37`) each define title, description, OG, Twitter and JSON-LD. The descriptions differ:

- `:7` is 256 chars and mentions geriatric prevention
- `tpl:14` is 199 chars and lists age groups
- `og:description` also differs between `:14` and `tpl:18`

Only the template's `<html lang="fr">` (`tpl:2`) survives rendering. The template also adds `geo.*` meta (`tpl:34-36`), which the static head lacks. Option A (§1) removes the duplication: one head per language page.

### 8. Performance (P2)

Measured from the decoded manifest:

| Asset | Size | Displayed | Suggestion |
|---|---|---|---|
| Logo PNG `1aca75c8…` | 1,544,003 B, 1024×1024 | max 230 px (`tpl:461`, `tpl:654`) | Resize to 460 px (2×). WebP or optimized PNG, probably <40 KB |
| 7 photos (PNG) | 129–223 KB each, 287×510 | `aspect-ratio:3/4` and `4/5` with `object-fit:cover` | Re-export from originals as WebP/AVIF at display size ×2. Add `width`/`height` and `loading="lazy"` below the fold. 287 px source is also low resolution for desktop |
| Fonts | 21 woff2, ~400 KB raw | Cyrillic and Vietnamese subsets of Cormorant Garamond and Jost (`tpl:39-343`) are never used | Ship latin, latin-ext and arabic subsets only. Preload only the hero font |
| React + ReactDOM UMD + DC runtime | ~208 KB raw | needed only for the toggle | Not needed with static HTML |
| Delivery | base64 (+33%) inside a 4.49 MB HTML with `cache-control: public, max-age=0, must-revalidate` | everything waits for `DOMContentLoaded` plus decode | Separate files get long-lived caching from Cloudflare Pages |

As static files, each image becomes its own fetch, under its own limit ("each resource referenced in the HTML … is fetched separately", [Googlebot](https://developers.google.com/search/docs/crawling-indexing/googlebot)). *Not measured*: real Core Web Vitals. Run PageSpeed Insights before and after.

### 9. Local SEO / NAP / Google Business Profile (P2)

On-site NAP is consistent across the FR contact block (`tpl:594`), the AR block (`tpl:786`), JSON-LD and the map embed query (`tpl:606`): "Capital Business Center, 44 angle rue El Azhari et rue Errouda, 4e étage, bureau 12, Marrakech 40000", phones 06 01 16 28 06 and 05 24 20 19 44.

*Unverified*: I did not open the Google Business Profile. Things to check there:

- **Name.** It "should reflect your business's real-world name" and "Including unnecessary information in your business name isn't permitted" ([GBP guidelines](https://support.google.com/business/answer/3038177)). It should equal the name on the door and on the site.
- **Website field.** It should be `https://ayapsychomotricite.ma/` (apex, https). "Provide a website that represents your individual business location".
- **Profiles.** "A practitioner shouldn't have multiple Business Profiles to cover all of their specializations" (same). Make sure there is a single profile.
- **Phone and category.** The primary phone should match JSON-LD `telephone`. Pick the closest available category. *Category list not verified.*
- **sameAs.** Optionally add the GBP / Maps place URL. Use a stable `https://www.google.com/maps?cid=…` URL from the profile rather than the `maps.app.goo.gl` short link. *Unverified* whether Google uses it.

The review link (`tpl:568`) is a Google *search* URL. A direct GBP review link (from the profile's "Ask for reviews") is more robust.

### 10. llms.txt (P3, optional)

llms.txt is "a proposed standard". It is an informal proposal by Jeremy Howard, first published 2024-09-03, at `/llms.txt`. The only required section is an H1 ([llmstxt.org](https://llmstxt.org/)). Google says "You don't need to create new machine readable files, AI text files, or markup to appear in these features" ([AI features](https://developers.google.com/search/docs/appearance/ai-features)). None of the OpenAI, Anthropic or Perplexity crawler pages consulted say their crawlers read it. Adoption by answer engines is therefore unproven. It costs one small file, so add it only if you want it. Do it after §1, because it is no substitute for crawlable HTML.

```markdown
# Cabinet de Psychomotricité Aya Alaoui El Hadari

> Cabinet de psychomotricité et de graphothérapie à Marrakech (Maroc), tenu par Aya Alaoui El Hadari, psychomotricienne et graphothérapeute. Bébés, enfants, adolescents, adultes et personnes âgées. Consultations en français et en arabe, uniquement sur rendez-vous.

Adresse : Capital Business Center, 44 angle rue El Azhari et rue Errouda, 4e étage, bureau 12, Marrakech 40000. Téléphone / WhatsApp : +212 6 01 16 28 06. Fixe : +212 5 24 20 19 44.

## Pages
- [Accueil (français)](https://ayapsychomotricite.ma/): soins, expertises (graphothérapie, prévention gériatrique), cabinet, FAQ, contact
- [الصفحة الرئيسية (العربية)](https://ayapsychomotricite.ma/ar/): النسخة العربية

## Optional
- [Instagram](https://www.instagram.com/ayapsychomotricite/)
- [Facebook](https://www.facebook.com/ayapsychomotricite)
```

### 11. Headings, alt text, lang/dir (P3)

- **Headings are fine.** One `h1` per language branch (`tpl:449`, `tpl:642`), section `h2`s, and card `h3`s.
- **Small "eyebrow" labels.** Lines such as "Soins & accompagnements" are `<span>`s. That is fine.
- **Alt text.**
  - "Le cabinet" (`tpl:519`) is generic. Describe the photo instead, e.g. « Salle de psychomotricité du cabinet à Marrakech ».
  - The gallery alts are acceptable. Make them specific to what each photo shows. *Photos not viewed in this audit.*
  - The logo alt "Logo Aya Alaoui El Hadari" is fine.
- **lang/dir.**
  - The AR branch `<div dir="rtl">` (`tpl:622`) lacks `lang="ar"`, and `<html>` stays `lang="fr"`.
  - Arabic fragments inside FR pages also lack `lang="ar"`: the footer at `tpl:612`, the review at `tpl:560`, and `public/404.html:35`.
  - With option A, `/ar/` gets `<html lang="ar" dir="rtl">` and any embedded French gets `lang="fr"`.

### 12. `Aya Psychomotricite - Site.html` (P3)

It is the original design-tool export from the first commit (`82e3167`). Compared with `public/index.html` it:

- lacks `lang="fr"`, the Expertises section, the Facebook links, the absolute `og:image`, and the canonical, robots and JSON-LD tags
- uses the old map embed

Cloudflare Pages serves `public/`. The live URL `/Aya%20Psychomotricite%20-%20Site.html` returns 404, so it is not deployed. It is the design source, not a deliverable. To avoid confusion, move it to `design/` (or delete it if the design tool holds the source). Never copy it over `public/index.html`.

### 13. www redirect (P1)

`https://www.ayapsychomotricite.ma/` returns 200 with the same page. `http://` correctly 301s to `https://ayapsychomotricite.ma/`. The canonical tag (`:8`) mitigates the duplicate, but a 301 is cleaner. Cloudflare Pages `_redirects` does not support domain-level redirects (marked ❌ in [Pages redirects](https://developers.cloudflare.com/pages/configuration/redirects/)), which explains why `a662e8d` dropped it. Cloudflare points to **Bulk Redirects** instead: source `www.ayapsychomotricite.ma`, target `https://ayapsychomotricite.ma`, 301, preserve path and query. A zone-level Redirect Rule should also work. *Not verified in the fetched page.*

## Not verified / out of scope

- Google's actual rendered HTML and index status. Check URL Inspection and `site:ayapsychomotricite.ma`.
- The Cloudflare dashboard settings behind the 403s.
- Google Business Profile contents and category.
- Rich Results Test / schema validator runs on the proposed JSON-LD.
- Real Core Web Vitals.
- Moroccan professional-registration rules.
- Whether any answer engine reads `llms.txt`.
- How the AI crawlers actually render pages. I relied on Google's general statement that not all bots run JS; the OpenAI, Anthropic and Perplexity pages consulted don't document JS rendering.
