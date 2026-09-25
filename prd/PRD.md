# Portfolio — PRD & Project Knowledge Base

Single source of truth for the **Khalid Al Dosari portfolio website**. Paste this whole file at the
start of a new AI session (Claude, ChatGPT, Cursor, etc.) so any tool has full, accurate context —
**no guessing, no hallucinating, consistent output every time.**

> **Maintenance rule:** this file describes the project as of **May 2026**. If you change a design
> token, add a section, or move a file, **update this PRD in the same commit.** A stale PRD teaches
> the AI to hallucinate confidently.

---

## 1. Quick Brief (TL;DR)

**What it is:** a single-page "navy glass" static portfolio with a **day theme** (light navy glass)
and a **night theme** (the original dark palette), built as vanilla HTML/CSS/JS with
**no build step, no framework**, hosted on **Cloudflare via Wrangler**. Everything that ships lives
in `static/`. Sections: Profile, About (with Languages in its facts), Education, Experience,
Projects, Certifications, Skills.
Custom brand fonts (Thmanyah) are served from a **separate GitHub repo via jsDelivr**, not bundled.

**Absolute rules (do NOT violate):**
- ❌ No frameworks/bundlers/Tailwind/npm packages. ✅ Plain HTML/CSS/JS only.
- ✅ Use CSS custom-property **design tokens** from `:root` in `static/styles.css`; don't hardcode.
- ✅ **Relative paths** for all internal assets/links. No leading-slash absolute paths.
- ✅ Thmanyah fonts load from `cdn.jsdelivr.net/gh/khaliddosari/thmanyah-fonts@v1/…`.
  Don't re-add a local `static/fonts/` folder.
- ✅ One page only (`static/index.html`). New cards/sections must copy existing markup (see §4
  components).
- ✅ Keep contact info identical across the profile panel, About facts, and page footer; keep the
  bilingual (Arabic + English) identity.
- ✅ **Both themes share one component system.** Components read semantic tokens only; a colour
  change goes in the day or night token block, never in a component.
- ✅ One tag class: `.chip`, for project tech stacks and skills alike.
- ⚠️ Known wording inconsistency: hero/header say "AI Engineer" but `<head>` meta/OG tags still
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
navigation, day and night themes, "navy glass" aesthetic, bilingual touches (English + Arabic).

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
| Behavior | Vanilla JavaScript, no dependencies (`script.js`) |
| Hosting | Cloudflare (static assets) via Wrangler |
| Config | `wrangler.jsonc` (project root) |

**Third-party dependencies (all via CDN — nothing installed locally):**
| Dependency | Version | Loaded from | Purpose |
|------------|---------|-------------|---------|
| Thmanyah typeface | tag `@v1` | cdn.jsdelivr.net | The only font, both scripts (see §7) |

Icons are an inline SVG sprite at the top of `index.html` (Lucide-style strokes), not an icon font.
Google Fonts, Font Awesome and AOS were removed in the September 2026 redesign.

**Folder / file structure**
```
Portfolio/                     <- git repo root
├─ wrangler.jsonc              <- Cloudflare config (serves ./static)
├─ .gitignore
├─ prd/                        <- THIS knowledge base (PRD.md)
└─ static/                     <- everything that gets deployed
   ├─ index.html               <- the whole page
   ├─ styles.css               <- all styling + design tokens
   ├─ script.js                <- theme toggle, active nav, panel counts, scroll restore
   ├─ favicon.ico
   ├─ logo.png                 <- brand logo used by navbar + side menu (HTML references "logo.png")
   └─ assets/
      ├─ photo.jpg             <- hero portrait
      ├─ cv.pdf                <- résumé (linked from header / profile / footer)
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
- A small inline `<script>` in `<head>` sets `data-theme` on `<html>` before first paint (stored
  choice, else the system setting). Keep it inline and before the stylesheet, or the page flashes
  the wrong theme. `script.js` loads with `defer`.

---

## 4. Design System

> Redesigned September 2026 with the **navy-glass-ui** skill
> (github.com/khaliddosari/navy-glass-skill), ported to plain CSS since the site has no build step.
> All tokens are CSS custom properties in `static/styles.css`.
> **Always use the token, never hardcode** a raw value a token already covers.

**Two themes, one component system.** `<html data-theme="light|dark">` picks the palette. Every
component reads the same semantic tokens, so a button, panel or chip has the same shape, size,
weight and spacing in both themes; only colour changes. The toggle is the sun/moon button in the
header. First visit follows the system setting; a click is stored in `localStorage` (`theme`).

| Theme | Look | Source |
|-------|------|--------|
| Day (`:root`) | Light navy glass: translucent white panels over a navy/sky/indigo wash, hue 250–264 everywhere | the skill's `theme.css` |
| Night (`:root[data-theme="dark"]`) | The original portfolio: `#0a0a0f` background, `#e8e8ed` / `#9999a8` text, `#4fc3f7 → #0288d1` accent, white-alpha glass, cyan/blue/purple glow | the pre-redesign tokens |

**Semantic tokens** (defined in both theme blocks)
| Token | Day | Night | Use |
|-------|-----|-------|-----|
| `--background` | `oklch(0.975 0.01 250)` | `#0a0a0f` | Page |
| `--foreground` | `oklch(0.16 0.045 258)` | `#e8e8ed` | Headings, emphasis, `<b>` in prose |
| `--muted-foreground` | `oklch(0.36 0.045 258)` | `#9999a8` | Body copy, labels, dates |
| `--primary` | navy `oklch(0.3 0.105 262)` | `#4fc3f7` | Tab underline, org/degree lines, skill labels |
| `--primary-fill` | navy gradient | `linear-gradient(135deg, #4fc3f7, #0288d1)` | Primary buttons |
| `--primary-foreground` | near-white | `#000` | Text on primary buttons |
| `--tint` / `--tint-foreground` / `--tint-edge` | pale navy / navy | cyan 18→6% / `#4fc3f7` / cyan 20% | Secondary buttons, chips, active nav |
| `--hover` | pale navy | `rgba(255,255,255,0.08)` | Ghost/outline hover |
| `--panel` / `--panel-weak` / `--card` | white 66% / 36% / 66% | white-alpha gradients 8→2% / 4→1% / 8→2% | Glass surfaces |
| `--glass-edge`, `--glass-highlight`, `--glass-shadow`, `--card-shadow`, `--glass-blur` | white edge, navy shadow | white 12% edge, inset highlights, black shadow | The glass recipe |
| `--border`, `--divider`, `--ring` | navy alphas | white alphas, cyan ring | Hairlines, focus |
| `--wash`, `--wash-filter` | four navy/sky/indigo pools | the original four cyan/blue/purple glows + `blur(40px)` | `body::before` |

The **wash** (`body::before`, fixed) is what the glass blurs. Don't remove it; panels look like flat
boxes without it. Fallbacks for `prefers-reduced-transparency` and for browsers without
`backdrop-filter` make surfaces nearly opaque; keep them.

**Typography:** Thmanyah Sans is the whole UI (it carries Arabic and Latin). Weights loaded: 400,
500, 700. Thmanyah Serif Display Black (`--font-brand`) is used only for the header wordmark and the
Arabic name. Mono (`--font-mono`, system stack) for the tab counts. Scale is
one step up from Tailwind: `--text-xs` 13px, `--text-sm` 15px (body default), `--text-base` 17px.
Headings and buttons get Thmanyah's alternate letterforms (`--ornate`); body text does not.

**Shape and spacing:** `--radius: 0.9rem` and a derived scale (`--radius-md/lg/xl/2xl`). Panels
`--radius-2xl`, inner cards `--radius-xl`, buttons `--radius-lg`. Density over padding: `--gap`
0.75rem between panels, `--pad` 0.875–1rem inside, `--gutter` 0.75–1.25rem page edge, page max
width `--page-max` 105rem. Controls are 40px tall on touch, 32px with a mouse from 64rem
(`--control-h`).

**Layout (`.page`, a 12-column grid from 64rem):**
- Row 1: Profile (4 cols) + About (8 cols) from 80rem; below that the profile is a full-width banner.
- Row 2: Education + Experience (6 + 6).
- Then Projects, Certifications, Skills, each full width.
- Phones: one column; the header nav becomes a horizontally scrolling strip that follows the
  current section.

**Components (CSS class vocabulary)**
- **Buttons:** `.btn` + one of `.btn-primary`, `.btn-secondary` (tinted), `.btn-outline`
  (icon buttons), `.btn-ghost` (footer icons); sizes `.btn-sm`, `.btn-icon`. Variants change colour
  only.
- **Panel:** `section.panel` > `header.panel-head` (`h2.panel-title`, no
  count) + `.panel-body`. A panel that holds cards adds `.panel-weak` so only
  the inner cards are full-strength glass.
- **Card:** `article.card` inside `.card-grid` (`.projects-grid`, `.certs-grid`).
- **Chip:** `li.chip` inside `ul.chips`: project tech stacks and skills.
- **Header:** `.site-header` > `.brand` (`.brand-tile` + `.brand-name`), `nav.site-nav` >
  `.nav-link` (`.is-active`), `.header-actions` (`#themeToggle`, CV button).
- **Profile:** `#hero.panel.profile` > `.profile-id` (`.avatar`, `.name-ar`, `h1.name-en`,
  `.profile-role`) + `.profile-actions` (`.contact-links`).
- **About:** `#about` > `.about-text` + `dl.facts` > `.fact` (dt/dd). `#languages` is the Languages
  fact.
- **Education / Experience:** `.panel-body.entries` > `article.entry` > `img.logo-tile` +
  `.entry-main` (`.entry-top` with `.entry-title`, `.entry-sub`; `.entry-date`;
  `ul.bullets.prose`).
- **Tabs (line variant, for a switch inside a panel):** `div.tabs[role=tablist]` in the
  `.panel-head` > `button.tab[role=tab]` (`aria-selected`, `aria-controls`, `.tab-count`); each
  panel is a `[role=tabpanel]`, the inactive one `hidden`. The active tab's underline sits on the
  header divider. On phones the tabs take their own full-width row.
- **Certifications:** two tab panels, `#cert-professional` and `#cert-courses` (both `.certs-grid`),
  each holding `article.card.cert` > `img.logo-tile` + `.cert-main` (`h3.cert-title`,
  `.cert-foot` > `.cert-meta` (`.cert-org`, `.cert-date`) + Verify/PDF button).
- **Skills:** `.panel-body.skill-rows` > `.skill-row` > `h3.skill-label` + `ul.chips`.
- **Footer:** `.site-footer` > `.footer-links` (start side) + copyright (end side).
- **Prose:** `.prose` = muted body copy with `<b>` lifted to full contrast.
- **Icons:** `<svg class="icon"><use href="#i-mail"/></svg>`; symbols: `i-cv`, `i-mail`, `i-phone`,
  `i-linkedin`, `i-github`, `i-external`, `i-arrow`, `i-calendar`, `i-verify`, `i-file`, `i-sun`,
  `i-moon`.

**Motion:** nearly none, by design. Colour transitions on hover only. No scroll reveals, no hover
lifts, no animated indicators.

**Visual principles (keep when generating UI)**
1. Every content block is a glass panel with a titled header (no numbering).
2. Surfaces are translucent glass over the wash; only the innermost surface in a stack is full
   strength.
3. Density comes from layout (grids, rows, label-beside-value), not from small text or cramped
   padding.
4. No status pills or badges on cards; the content and its links carry the meaning.
5. Logical properties (`margin-inline-start`, `padding-inline`, `text-align: start`) so the page can
   mirror for Arabic later without rewrites.

---

## 5. JS Behavior

`script.js` (vanilla, no dependencies, `defer`) handles:
- **Scroll restoration:** manual; resets to top on fresh load, restores position on reload
  (via `sessionStorage`).
- **Theme:** `#themeToggle` flips `data-theme`, stores the choice, updates `aria-pressed` and
  `<meta name="theme-color">`. Until a choice is stored, it follows system changes.
- **Tab counts:** any `[data-count="<selector>"]` shows how many elements match, so adding a
  certificate updates its tab.
- **Tabs:** any `[role=tablist]` switches its panels on click, Left/Right arrows (following the
  reading direction, wrapping) and Home/End; only the selected tab is in the Tab order.
- **Active link highlighting:** adds `.is-active` and `aria-current` to the nav link for the section
  in view (panels sharing a row light up together; the last row wins at the page bottom). On phones
  it scrolls the nav strip to keep the active link visible.

Extend these patterns; don't duplicate listeners.

---

## 6. Content Spec

The page is one scroll. **Section order and `id`s (nav anchors):**
`hero` (profile panel) → `about` (includes the `languages` fact) → `education` → `experience` →
`projects` → `certifications` → `skills` → footer. Panel titles are not numbered.
Header nav order: About · Education & Experience (one link, to `#education`) · Projects · Certifications · Skills.

**`<head>` / SEO**
- `<title>`: **Khalid - Portfolio**
- `meta description`: "Khalid's Portfolio - CS Student specializing in Machine Learning & AI Engineering"
- `meta keywords`: portfolio, machine learning, AI, computer science, software engineer
- `meta author`: Khalid
- `og:title`: "Khalid - CS Student | **ML & AI Engineer**"
- `og:description`: "Portfolio showcasing projects, experience, and skills in ML & AI Engineering."

> ⚠️ **Inconsistency:** hero/side menu say **"AI Engineer"**, but `<head>` meta/OG tags still say
> **"ML & AI Engineer"**. For full consistency these should be updated too — confirm before editing.

**Header (sticky):** logo (`logo.png`) on a dark brand tile + wordmark **Khalid Al Dosari**,
section links, theme toggle, CV button. No hamburger or side drawer: on phones the links scroll
sideways inside the header.

**Profile (`#hero`):** portrait `assets/mypic.jpeg` (hidden via `onerror` if it fails); Arabic name
**خالد آل دوســـــري**; English name **Khalid Al Dosari** (the page `h1`); tagline **CS Student |
AI Engineer / Tuwaiq Academy Alumnus**; CTA "View My Work" → `#projects`; CV; icon buttons for
email, phone, LinkedIn, GitHub.

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

**Projects (`#projects`)** — 6 glass cards (in this order) with title, description, `.chip` tags, Code/Demo links:
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

**Certifications (`#certifications`):** 14 cards in two tabs, newest first within each.

*Professional* (default tab, 4):
| Certification | Org | Date | Link | Badge asset |
|---------------|-----|------|------|-------------|
| Professional Training Program in Large Language Models (NVIDIA) | SDAIA | August 2026 | Verify | `SDAIA.jpg` |
| Building Transformer-Based NLP Applications | Tuwaiq Academy | August 2026 | PDF | `tuwaiqacademy_logo.jpg` |
| Building Transformer-Based NLP Applications | NVIDIA | August 2026 | Verify | `nvidia_logo.jpg` |
| Data Science Bootcamp | OSS Vision Community | April 2026 | PDF | `OSS Vision Logo.jpg` |

*Courses* (10):
| Certification | Org | Date | Link | Badge asset |
|---------------|-----|------|------|-------------|
| Rapid Application Development with LLMs | NVIDIA | July 2026 | Verify | `nvidia_logo.jpg` |
| Building LLM Applications With Prompt Engineering | NVIDIA | July 2026 | Verify | `nvidia_logo.jpg` |
| Accelerating End-to-End Data Science Workflows | NVIDIA | July 2026 | Verify | `nvidia_logo.jpg` |
| Introduction to Transformer-Based Natural Language Processing | NVIDIA | June 2026 | Verify | `nvidia_logo.jpg` |
| Getting Started with Deep Learning | NVIDIA | June 2026 | Verify | `nvidia_logo.jpg` |
| AI-Native Engineering | Tuwaiq Club | May 2026 | PDF | `Tuwaiq Club Logo.jpg` |
| Supervised Machine Learning: Regression and Classification | DeepLearning.AI | April 2026 | Verify | `deeplearningai_logo.jpg` |
| Introduction to Data Science in Python | University of Michigan | April 2026 | Verify | `Michigan_logo.jpg` |
| Calculus for Machine Learning and Data Science | DeepLearning.AI | February 2026 | Verify | `deeplearningai_logo.jpg` |
| Python Programming | MCIT | July 2023 | PDF | `MCIT_logo.jpg` |

> "Professional Training Program in Large Language Models (NVIDIA)" (SDAIA) is the NCA-GENL
> program. A new certificate goes in *Professional* only if it is a professional certification
> or bootcamp; everything else is a course.


**Skills (`#skills`)** — grouped `.chip` tags, one `.skill-row` per group (in this display order):
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

**About facts (`dl.facts` in `#about`):** Focus, Degree, Bootcamp, Languages (`#languages`:
Arabic · English), Email, Phone. Values come from the rest of the page; keep them in step.

**Footer:** icon row on the start side (CV, email, phone,
LinkedIn, GitHub), then `© 2026 Khalid Al Dosari. All rights reserved.` on the end side.

**Content rules**
- **Contact details consistent** everywhere (profile panel, About facts, page footer).
- Keep the **bilingual** identity (Arabic + English name) — don't drop the Arabic line.
- One tag class, `.chip`, for project stacks and skills.
- New project/cert/skill/experience entries must **mirror existing markup** (same classes; see §4
  components). Counts in panel headers update themselves.

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

**Other externally-hosted assets:** none. Icons are inline SVG. The deploy contains only
HTML/CSS/JS, images, favicon, logo, and CV.

---

## 8. Guidelines & Conventions

**Hard rules** — see §1 Quick Brief. Plus:

**CSS**
- Custom properties for all theme values; organize by existing comment sections
  (`/* SHARED TOKENS */`, `/* DAY */`, `/* NIGHT */`, `/* BUTTONS */`, `/* PANELS */`, …).
- A new colour is a token defined in **both** the day and night blocks; components never branch on
  theme.
- Descriptive-kebab class names (`.cert-title`, `.panel-head`, `.skill-row`).
- Prefer extending existing component classes over inventing parallel ones.
- Glass surfaces: `background: var(--panel|--card)` + `box-shadow: 0 0 0 1px var(--glass-edge),
  var(--glass-highlight), var(--glass-shadow)` + `backdrop-filter: var(--glass-blur)`.
- Hover affordance: colour change only (no lifts). Logical properties only (`-inline-`, `start`).

**HTML**
- Content blocks: `<section class="panel …" id="…">` with a `header.panel-head` (the `h2`)
  and a `.panel-body`.
- Accessibility: `aria-label`s on icon-only links, `alt` on images, `onerror` placeholder fallbacks
  on content images.
- External links: `target="_blank" rel="noopener"`.

**JS** — see §5. Vanilla DOM only, no dependencies; extend existing patterns, don't duplicate
listeners.

**Git / workflow**
- Default branch: `main` (renamed from `master` in September 2026). Feature work happens on branches and merges into `main`.
- Commit messages: short, imperative, specific (e.g. "Make logo glow persistent in navbar and side menu").
- **Update this PRD in the same commit** as any design/content/structure change.

**Tone & copy:** professional, concise, growth-minded; first person in About; bilingual identity
is part of the brand — preserve it.

**When unsure:** read the actual source in `static/` before generating. If a fact isn't in this PRD
or the code, **ask** rather than invent — that is the entire point of this document.
