# Portfolio — PRD & Project Knowledge Base

Single source of truth for the **Khalid Al Dosari portfolio website**. Paste this whole file at the
start of a new AI session (Claude, ChatGPT, Cursor, etc.) so any tool has full, accurate context —
**no guessing, no hallucinating, consistent output every time.**

> **Maintenance rule:** this file describes the project as of **May 2026**. If you change a design
> token, add a section, or move a file, **update this PRD in the same commit.** A stale PRD teaches
> the AI to hallucinate confidently.

---

## 1. Quick Brief (TL;DR)

**What it is:** a single-page, dark-themed, "liquid glass" static portfolio (vanilla HTML/CSS/JS,
**no build step, no framework**) hosted on **Cloudflare via Wrangler**. Everything that ships lives
in `static/`. Sections: About, Education, Projects, Experience, Certifications, Skills, Languages.
Custom brand fonts (Thmanyah) are served from a **separate GitHub repo via jsDelivr**, not bundled.

**Absolute rules (do NOT violate):**
- ❌ No frameworks/bundlers/Tailwind/npm packages. ✅ Plain HTML/CSS/JS only.
- ✅ Use CSS custom-property **design tokens** from `:root` in `static/styles.css`; don't hardcode.
- ✅ **Relative paths** for all internal assets/links. No leading-slash absolute paths.
- ✅ Thmanyah fonts load from `cdn.jsdelivr.net/gh/khaliddosari/thmanyah-fonts@v1/…`.
  Don't re-add a local `static/fonts/` folder.
- ✅ One page only (`static/index.html`). New cards/sections must copy existing markup +
  `data-aos` / staggered `data-aos-delay` patterns.
- ✅ Keep contact info identical across hero, sidebar footer, and page footer; keep the bilingual
  (Arabic + English) identity.
- ⚠️ **Two tag classes:** projects use `.tag`, skills use `.skill-tag` — don't mix them.
- ⚠️ Known wording inconsistency: hero/sidebar say "AI Engineer" but `<head>` meta/OG tags still
  say "ML & AI Engineer". Don't silently change meta tags — confirm first.
- ❓ If a fact isn't in this PRD or the code, **ask** — don't invent.

**Identity / contact (must stay consistent):**
Khalid Al Dosari · خالد آل دوســـــري · IMSIU CS senior ·
khaliddosari70@gmail.com · +966 55 322 5155 ·
linkedin.com/in/khalid-al-dosari · github.com/khaliddosari

**Deploy:** `wrangler deploy` from repo root (config auto-discovered). Preview: `wrangler dev`.

---

## 2. Project Overview

A **single-page personal portfolio website** for Khalid Al Dosari — a senior Computer Science
student presenting himself as a **Data Scientist / AI Engineer**. One scrolling page with anchor
navigation, dark theme, "liquid glass" aesthetic, bilingual touches (English + Arabic).

**Owner / subject**
- **Name:** Khalid Al Dosari — خالد آل دوســـــري
- **Hero tagline:** `CS Student | Data Scientist | AI Engineer`
- **Sidebar tagline (shorter):** `Data Scientist | AI Engineer`
- **University:** Imam Mohammad bin Saud Islamic University (IMSIU), senior CS student
  (Bachelor's, Computer Science, August 2022 – present)
- **Contact (as published on site):** khaliddosari70@gmail.com · +966 55 322 5155
- **LinkedIn:** https://www.linkedin.com/in/khalid-al-dosari/
- **GitHub:** https://github.com/khaliddosari

> Note: "AI Engineer" replaced "ML Engineer" in the **hero and side menu**, but the `<head>`
> meta/Open-Graph tags still say "ML & AI Engineer" (see §6). Don't silently rewrite them; confirm first.

**Goals**
1. Present Khalid professionally to recruiters, hackathon organizers, and collaborators.
2. Showcase **projects**, **experience**, **certifications**, and **skills** at a glance.
3. Load fast, look premium, work on mobile, and be trivial to host/maintain.

**Non-goals**
- No backend, no database, no auth, no CMS.
- No build pipeline / bundler / framework. It stays plain HTML/CSS/JS on purpose.
- No blog, no contact form (contact is via direct links).

**Status:** Live / actively maintained static site, deployed on Cloudflare. Single page
(`index.html`), all content hand-authored.

---

## 3. Tech Stack & Structure

**Philosophy: no build step.** Hand-written static site — no bundler, transpiler, framework, or
`npm run build`. Files are served exactly as authored. Do not introduce React/Vue/Vite/Tailwind/etc.
unless explicitly asked; it would break the entire maintenance model.

| Layer | Choice |
|-------|--------|
| Markup | Plain HTML5 (`index.html`) |
| Styles | Plain CSS with CSS custom properties (`styles.css`) |
| Behavior | Vanilla JavaScript, no dependencies of its own (`script.js`) |
| Hosting | Cloudflare (static assets) via Wrangler |
| Config | `wrangler.jsonc` (project root) |

**Third-party dependencies (all via CDN — nothing installed locally):**
| Dependency | Version | Loaded from | Purpose |
|------------|---------|-------------|---------|
| Google Fonts | — | fonts.googleapis.com | Inter, IBM Plex Sans, IBM Plex Sans Arabic, JetBrains Mono |
| Font Awesome | 6.5.1 | cdnjs.cloudflare.com | Icons (`<i class="fas …">`) |
| AOS | 2.3.4 | cdnjs.cloudflare.com | Scroll-reveal animations |
| Thmanyah typeface | tag `@v1` | cdn.jsdelivr.net | Custom brand fonts (see §7) |

**Folder / file structure**
```
Portfolio/                     <- git repo root
├─ wrangler.jsonc              <- Cloudflare config (serves ./static)
├─ .gitignore
├─ prd/                        <- THIS knowledge base (PRD.md)
└─ static/                     <- everything that gets deployed
   ├─ index.html               <- the whole page
   ├─ styles.css               <- all styling + design tokens
   ├─ script.js                <- nav, mobile menu, scroll, AOS init
   ├─ favicon.ico
   ├─ logo.png                 <- brand logo used by navbar + side menu (HTML references "logo.png")
   └─ assets/
      ├─ photo.jpg             <- hero portrait
      ├─ cv.pdf                <- résumé (linked from hero / sidebar / footer)
      ├─ logo.png              <- duplicate copy of the logo (NOT the one the page loads)
      ├─ education/
      │   └─ university-logo.jpg
      ├─ experience/
      │   ├─ council-logo.jpg     (CCIS Student Council)
      │   ├─ company-logo.jpg     (THA Staffing)
      │   └─ company-logo-2.jpg   (Webook)
      └─ certifications/
          ├─ deeplearningai_logo.jpg
          ├─ Michigan_logo.jpg
          ├─ MCIT_logo.jpg
          └─ OSS Vison Logo.jpg   (used by the "Data Science Bootcamp" cert; filename misspells "Vision")
```

**Key architectural facts**
- **`wrangler.jsonc` sits in the repo root** and points at `static/` via
  `"assets": { "directory": "static" }`. Only the `static/` folder is deployed.
- All internal links in `index.html`/`styles.css` are **relative** (`styles.css`, `assets/photo.jpg`).
  No leading-slash absolute paths — keep the site path-portable.
- `script.js` depends on the global `AOS` object from the AOS CDN `<script>` — that tag must load
  before `script.js` (it does: AOS first, then `script.js`, at end of `<body>`).

---

## 4. Design System

> All tokens are CSS custom properties in `static/styles.css` under `:root`.
> **Always use the token, never hardcode** a raw value a token already covers.

**Theme:** dark, premium, "liquid glass" (frosted translucent surfaces over an ambient colored
glow). Cyan/blue accent on near-black background.

**Color tokens**
| Token | Value | Use |
|-------|-------|-----|
| `--bg-primary` | `#0a0a0f` | Page background |
| `--bg-secondary` | `#111118` | Secondary background |
| `--bg-card` | `rgba(255,255,255,0.04)` | Card surface |
| `--bg-card-hover` | `rgba(255,255,255,0.08)` | Card surface (hover) |
| `--text-primary` | `#e8e8ed` | Primary text |
| `--text-secondary` | `#9999a8` | Muted text |
| `--accent` | `#4fc3f7` | Accent (links, highlights) |
| `--accent-dark` | `#0288d1` | Accent (deep / hover) |
| `--accent-gradient` | `linear-gradient(135deg, #4fc3f7, #0288d1)` | Buttons, underlines, glows |
| `--border` | `rgba(255,255,255,0.08)` | Hairline borders |

**Liquid-glass tokens**
| Token | Value |
|-------|-------|
| `--glass-bg` | `linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))` |
| `--glass-bg-hover` | `linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))` |
| `--glass-blur` | `blur(24px) saturate(180%)` |
| `--glass-blur-strong` | `blur(32px) saturate(200%)` |
| `--glass-border` | `1px solid rgba(255,255,255,0.12)` |
| `--glass-highlight` | layered inset highlights/shadows (see source) |
| `--glass-shadow` | `0 12px 40px rgba(0,0,0,0.35)` |
| `--glass-shadow-hover` | `0 18px 55px rgba(0,0,0,0.45), 0 0 40px rgba(79,195,247,0.1)` |

A fixed, blurred **ambient color field** (`body::before`) sits behind everything with radial
cyan/blue/purple glows — this is what the frosted glass refracts. Don't remove it; glass looks flat
without it.

**Typography**
| Token | Stack | Role |
|-------|-------|------|
| `--font` | `'Inter', -apple-system, BlinkMacSystemFont, sans-serif` | Body text |
| `--font-heading` | `'IBM Plex Sans', -apple-system, sans-serif` | Headings, buttons |
| `--font-mono` | `'JetBrains Mono', monospace` | Mono / code accents |

Plus the custom **Thmanyah** families (loaded via jsDelivr CDN, `@font-face` at top of `styles.css`):
- `'Thmanyah Serif Display'` — editorial display serif (weights 400/700)
- `'Thmanyah Serif Text'` — editorial body serif (400/700)
- `'Thmanyah Sans'` — modern Arabian sans (400/700)
- `'Thmanyah'` — legacy alias → maps to Serif Display

Arabic text (e.g. the Arabic hero name) uses these / IBM Plex Sans Arabic.

**Spacing, shape, motion**
| Token / value | Meaning |
|---------------|---------|
| `--radius: 16px` | Default corner radius |
| `--transition: 0.3s ease` | Default transition |
| `.container` → `max-width: 1280px; padding: 0 24px` | Page width constraint |
| `.section` → `padding: 100px 0` | Vertical rhythm between sections |
| `.section-alt` | Alternating subtle gradient band background |
| Section titles | `--font-heading`, `2rem`, `700`, centered, gradient underline (`::after`) |

**Components (CSS class vocabulary)**
- **Buttons:** `.btn`, `.btn-primary` (accent gradient, black text), `.btn-sm`.
- **Nav / sidebar:** `#navbar` (gains `.scrolled` past 50px), `.nav-container`, `#navToggle`
  (`.hamburger`), `#navLinks`, `#navOverlay`; `.sidebar-header` / `.sidebar-brand` /
  `.sidebar-logo` / `.sidebar-name` / `.sidebar-tagline` / `.sidebar-footer` / `.sidebar-social`;
  nav items use a Font Awesome icon + `.nav-label`; active link gets `.active`.
- **Logo:** `.nav-logo` / `.logo-img` / `.sidebar-logo` (persistent glow effect).
- **Hero:** `.hero` > `.hero-content` > `.hero-photo`, `.hero-name` (+ `.hero-name-ar`),
  `.hero-tagline`, `.hero-contact`.
- **About:** `.about-content` (paragraphs).
- **Education:** `.education-grid` > `.edu-card` > `.edu-card-header`, `.edu-degree`, `.edu-dates`,
  `.edu-details`; volunteering uses `.exp-responsibilities`.
- **Projects:** `.projects-grid` > `.project-card` > `<h3>`, `.project-tags` > `.tag`, `.project-links`.
- **Experience:** `.timeline` > `.timeline-item` > `.timeline-dot` + `.timeline-content`
  > `.exp-header` (`.org-logo` + `<h3>` + `.exp-company`), `.exp-dates`, `.exp-responsibilities`.
- **Certifications:** `.certs-grid` > `.cert-card` > `.cert-badge` (img), `.cert-info`
  (`<h3>`, `.cert-org`, `.cert-date`, `.cert-links`).
- **Skills:** `.skills-container` > `.skill-group` > `.skill-tags` > `.skill-tag` (pill tags).
- **Languages:** `.languages-grid` > `.language-card` > `.language-name`.
- **Footer:** `.footer` > `.footer-social`, `.footer-copy`.
- **Shared:** `.org-logo` (education + experience logos, `onerror` hides on load fail).

> ⚠️ **Two distinct tag classes:** project chips are `.tag`; skill chips are `.skill-tag`. Styled
> separately — use the right one for the section.

**Animation:** AOS scroll reveals via `data-aos="fade-up"` and staggered `data-aos-delay="100|200|…"`.
Init in `script.js`: `duration 700, easing 'ease-out', once: true, offset: 80`.

**Visual principles (keep when generating UI)**
1. Surfaces are **translucent glass**, never flat opaque blocks — use the glass tokens.
2. Accent is **cyan→blue gradient**; use sparingly for emphasis, CTAs, underlines.
3. Generous spacing, centered section titles, rounded corners (`--radius`).
4. Subtle hover lift (`translateY(-2px)`) + stronger shadow/glow on interactive elements.
5. Respect existing token names — extend `:root` rather than scattering magic numbers.

---

## 5. JS Behavior

`script.js` (vanilla, only external dep is the AOS global) handles:
- **Scroll restoration:** manual; resets to top on fresh load, restores position on reload
  (via `sessionStorage`).
- **AOS init** (see §4).
- **Navbar:** toggles `.scrolled` on `#navbar` past 50px scroll.
- **Mobile menu:** `#navToggle` toggles `#navLinks` / `#navOverlay` open state + body scroll lock;
  closes on overlay click or when an anchor link is clicked.
- **Active link highlighting:** adds `.active` to the nav link of the section currently in view.

Extend these patterns; don't duplicate listeners.

---

## 6. Content Spec

The page is one scroll. **Section order and `id`s (nav anchors):**
`hero` → `about` → `education` → `projects` → `experience` → `certifications` → `skills` →
`languages` → footer.
Side-menu nav order: About · Education · Projects · Experience · Certifications · Skills · Languages.

**`<head>` / SEO**
- `<title>`: **Khalid - Portfolio**
- `meta description`: "Khalid's Portfolio - CS Student specializing in Machine Learning & AI Engineering"
- `meta keywords`: portfolio, machine learning, AI, computer science, software engineer
- `meta author`: Khalid
- `og:title`: "Khalid - CS Student | **ML & AI Engineer**"
- `og:description`: "Portfolio showcasing projects, experience, and skills in ML & AI Engineering."

> ⚠️ **Inconsistency:** hero/side menu say **"AI Engineer"**, but `<head>` meta/OG tags still say
> **"ML & AI Engineer"**. For full consistency these should be updated too — confirm before editing.

**Navbar / side menu:** logo (`logo.png`), sidebar brand **Khalid Al Dosari**, sidebar tagline
**Data Scientist | AI Engineer** (shorter than hero — no "CS Student"), icon + `.nav-label` items,
footer social row (CV, email, phone, LinkedIn, GitHub).

**Hero (`#hero`):** portrait `assets/photo.jpg` (placeholder fallback via `onerror`); Arabic name
**خالد آل دوســـــري**; English name **Khalid Al Dosari**; tagline **CS Student | Data Scientist |
AI Engineer**; contact row (CV, email, phone, LinkedIn, GitHub); CTA "View My Work" → `#projects`.

**About (`#about`) — two paragraphs:**
1. Senior CS student at IMSIU building toward AI/ML engineering; solid theoretical foundation via
   ML/AI/data-science certifications; actively converting it into hands-on experience through
   projects, hackathons, and intensive training.
2. ~2 years supervising operations for some of Saudi Arabia's biggest/most prestigious events, plus
   volunteering and leading in student clubs — taught leading under pressure, cross-team
   coordination, and real-time problem solving.

**Education (`#education`):**
- **Imam Mohammad bin Saud Islamic University (IMSIU)** — Bachelor's degree, Computer Science —
  **August 2022 – present** — logo `assets/education/university-logo.jpg`.
- Below a "Volunteering:" label, two `.exp-responsibilities` bullets:
  1. Built a strong foundation in software engineering, machine learning, and artificial
     intelligence, applied directly to deployed projects.
  2. Active in extracurriculars as Media & Design Deputy Leader at CCIS Student Council and a
     graphic-design volunteer at Tuwaiq Club, Google Developers Student Club, and Information
     Security Club.

**Projects (`#projects`)** — 6 glass cards (in this order) with title, description, `.tag` chips, Code/Demo links:
| # | Project | Summary | Tags | Code | Demo |
|---|---------|---------|------|------|------|
| 1 | **Namtheg AutoML** | End-to-end, agentic AutoML platform: upload raw dataset → pick target → train custom model → deploy to production cloud via API. | Python, FastAPI, NEXT.JS, Modal, LangChain, DeepSeek API, TypeScript, React, Render | github.com/khaliddosari/AutoML | https://namtheg.onrender.com/ |
| 2 | **Nusuk** | Agentic course recommender: parses a student's academic transcript and recommends 5 best-fit elective courses based on prior grades. | Python, JavaScript, Node.js, MongoDB, HTML, CSS, Gemini API | github.com/khaliddosari/web-project | — (demo link commented out) |
| 3 | **3ajib** | AI-powered tourism-intelligence platform — **4th place at PwC Empowerthon**. Turns Saudi destination visitor data into insights (AI demo, ROI calculator, analytics dashboard, bilingual). | React, TypeScript, Vite, Supabase, Voiceflow, HTML, JavaScript, CSS | github.com/khaliddosari/3ajib | https://khaliddosari.github.io/3ajib/ |
| 4 | **Cashy - Cash Back Optimizer** | Algorithms project comparing Brute Force (O(nᵐ)) vs Greedy (O(n×m)) to optimize cashback across cards/categories — optimality vs efficiency tradeoff. | Java, HTML, JavaScript, CSS, Cloudflare | github.com/khaliddosari/cashback-optimizer | https://khaliddosari.github.io/cashback-optimizer/ |
| 5 | **N-Queens CSP** | AI course project solving N-Queens via 3 CSP algorithms (Backtracking, Forward Checking, MAC) with MRV/Degree/LCV heuristics + interactive visualizer. | Java, Spring Boot, Maven, HTML, JavaScript, CSS | github.com/khaliddosari/n-queens | https://n-queens.up.railway.app/ |
| 6 | **LALR Parser** | Compilers course project: LALR(1) parsing from scratch in Java — builds canonical LR(1) item sets, merges to LALR table, detects conflicts, step-by-step trace. | Java, Spring Boot, Maven, REST API, Docker, HTML, JavaScript, CSS | github.com/khaliddosari/lalr-parser | https://lalr-parser.fly.dev/ |

**Experience (`#experience`) — vertical timeline:**
| Role | Org | Dates | Logo |
|------|-----|-------|------|
| **Media & Design Deputy Lead** | CCIS Student Council | September 2025 – Present | `assets/experience/council-logo.jpg` |
| **Zone Manager** | THA Staffing | Jan 2026 – Present | `assets/experience/company-logo.jpg` |
| **Team Supervisor** | Webook | October 2024 – November 2025 | `assets/experience/company-logo-2.jpg` |

Each has 2–3 `.exp-responsibilities` bullets. Webook work covered high-profile Saudi events
(Saudi Pro League matches, Riyadh Season boxing, WTA tennis, concerts) for the Ministry of Sport,
General Entertainment Authority, and Ministry of Culture.

**Certifications (`#certifications`):** 5 cards, in this order:
| Certification | Org | Date | Link | Badge asset |
|---------------|-----|------|------|-------------|
| Data Science Bootcamp | OSS Vision Community | April 2026 | Verify (Google Drive) | `OSS Vison Logo.jpg` |
| Supervised Machine Learning: Regression and Classification | DeepLearning.AI | April 2026 | Verify (Coursera) | `deeplearningai_logo.jpg` |
| Introduction to Data Science in Python | University of Michigan | April 2026 | Verify (Coursera) | `Michigan_logo.jpg` |
| Calculus for Machine Learning and Data Science | DeepLearning.AI | February 2026 | Verify (Coursera) | `deeplearningai_logo.jpg` |
| Python Programming | MCIT | July 2023 | PDF (Google Drive) | `MCIT_logo.jpg` |

> A commented-out duplicate "Python Programming" card (org spelled out as "Ministry of
> Communications and Information Technology of Saudi Arabia") still exists in the source.
> Note the badge filename `OSS Vison Logo.jpg` misspells "Vision" — the card itself reads
> "OSS Vision Community".

**Skills (`#skills`)** — grouped `.skill-tag` pills (in this display order):
- **Programming Languages:** Python, Java, SQL, JavaScript, TypeScript, HTML, CSS
- **Model Architecture:** CNNs, RNNs, Auto-encoders, Gradient Boosting, Random Forests, Anomaly Detection
- **Databases:** PostgreSQL, MySQL, MongoDB
- **Cloud & Infrastructure:** Modal, Cloudflare, Vercel
- **Specialized Domains:** Data Science, Machine Learning, Deep Learning, Natural Language
  Processing (NLP), Computer Vision, Data Visualization, Agentic AI, AI-Native Engineering, MLOps
- **Libraries, Tools & Frameworks:** PyTorch, TensorFlow, Scikit-learn, LangChain, LangGraph,
  FastAPI, RestAPI, Next.js, Pandas, NumPy, Matplotlib, Power BI, Excel, Overleaf
- **DevOps & Environments:** Git, GitHub, Bash, Docker, Spring Boot, Maven, Jupyter, VS Code,
  Google Colab, Render, Fly.io
- **Soft Skills:** Leadership, Project Management, Teamwork, Communication Skills, Problem Solving

**Languages (`#languages`):** Arabic · English.

**Footer:** social/contact row (same links as hero) + `© 2026 Khalid Al Dosari. All rights reserved.`

**Content rules**
- **Contact details consistent** everywhere (hero, sidebar footer, page footer).
- Keep the **bilingual** identity (Arabic + English name) — don't drop the Arabic line.
- **Two tag classes:** projects `.tag`, skills `.skill-tag`. Don't mix.
- New project/cert/skill/experience entries must **mirror existing card markup** (same classes,
  same `data-aos` pattern, incrementing `data-aos-delay`).

---

## 7. Deployment & Fonts

**Hosting: Cloudflare via Wrangler.** Config `wrangler.jsonc` at the repo root:
- `"name": "portfolio"`
- `"compatibility_date": "2026-05-27"`
- `"compatibility_flags": ["nodejs_compat"]`
- `"observability": { "enabled": true }`
- `"assets": { "directory": "static" }` ← **only `static/` is uploaded**

Config is at root, so Wrangler auto-discovers it — no `--config` flag needed.
```powershell
wrangler deploy      # ship
wrangler dev         # local preview
```
(Wrangler must be on PATH, or run via `npx wrangler`.)

**Fonts via separate repo + jsDelivr.** To keep the deploy lean, the Thmanyah typeface is **not** in
`static/`; it lives in its own GitHub repo, served through jsDelivr.
- **Repo:** `github.com/khaliddosari/thmanyah-fonts`
- **CDN base:** `https://cdn.jsdelivr.net/gh/khaliddosari/thmanyah-fonts@v1/`
- **Referenced in:** the `@font-face` blocks at the top of `static/styles.css`.
- Files keep the original nested layout, e.g.
  `…@v1/thmanyah%20typeface/thmanyahsans/woff2/thmanyahsans-Regular.woff2`.

**Why a version tag (`@v1`)?** jsDelivr caches a tagged ref permanently → fast, stable loads.
To change a font: (1) push updated file(s) to `thmanyah-fonts`; (2) create + push a **new tag**
(`v2`); (3) bump `@v1` → `@v2` in the `styles.css` URLs. **Never reuse an existing tag.**

**One-time publish of the fonts repo:**
```powershell
cd "C:\Users\Khalid\Downloads\Coding Projects\thmanyah-fonts"
git remote add origin https://github.com/khaliddosari/thmanyah-fonts.git
git push -u origin main
git tag v1
git push origin v1
# verify (expect HTTP 200):
curl.exe -I "https://cdn.jsdelivr.net/gh/khaliddosari/thmanyah-fonts@v1/thmanyah%20typeface/thmanyahsans/woff2/thmanyahsans-Regular.woff2"
```

**Other externally-hosted assets:** Font Awesome (6.5.1), AOS (2.3.4), and Google Fonts load from
their own CDNs — none bundled. The deploy contains only HTML/CSS/JS, images, favicon, logo, and CV.

---

## 8. Guidelines & Conventions

**Hard rules** — see §1 Quick Brief. Plus:

**CSS**
- Custom properties for all theme values; organize by existing comment sections
  (`/* VARIABLES */`, `/* RESET */`, `/* UTILITIES */`, `/* BUTTONS */`, …).
- Descriptive-kebab class names (`.skill-tag`, `.cert-card`, `.hero-tagline`).
- Prefer extending existing component classes over inventing parallel ones.
- Glass surfaces compose from `--glass-bg`, `--glass-blur`, `--glass-border`, `--glass-shadow`.
- Hover affordance: subtle `translateY(-2px)` + stronger shadow/glow.

**HTML**
- Semantic sections: `<section class="section" id="…">` (add `section-alt` for alternating bands).
- Section heading: `<h2 class="section-title" data-aos="fade-up">Title</h2>`.
- Accessibility: `aria-label`s on icon-only links, `alt` on images, `onerror` placeholder fallbacks
  on content images.
- External links: `target="_blank" rel="noopener"`.

**JS** — see §5. Vanilla DOM only (plus AOS global); extend existing patterns, don't duplicate
listeners; AOS must init after its CDN script loads (order already correct).

**Git / workflow**
- Default working branch: `master` (PRs usually target `main`).
- Commit messages: short, imperative, specific (e.g. "Make logo glow persistent in navbar and side menu").
- **Update this PRD in the same commit** as any design/content/structure change.

**Tone & copy:** professional, concise, growth-minded; first person in About; bilingual identity
is part of the brand — preserve it.

**When unsure:** read the actual source in `static/` before generating. If a fact isn't in this PRD
or the code, **ask** rather than invent — that is the entire point of this document.
