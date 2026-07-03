# Frontend — josepaulotimbang.com

The Next.js frontend for [josepaulotimbang.com](https://josepaulotimbang.com), statically exported and deployed to Hostinger shared hosting.

---

## Introduction

This is the public-facing site: home, about, projects, skills, experience, blog, resume, and contact pages, plus a floating AI chat widget. It's built with the Next.js App Router and exported as static HTML — there's no Node.js server in production, so hosting is just files served over Apache.

All dynamic content (projects, posts, skills, experience) comes from the CodeIgniter 4 API in `../backend`. See the [root README](../README.md) for the full-stack overview, API details, and deployment pipeline.

---

## Features

- **Static Export** — `next build` produces static HTML/CSS/JS in `out/`, no server runtime required in production
- **Pages** — Home, About, Projects (list + detail), Skills, Experience, Resume, Blog (list + detail), Contact
- **AI Resume Chatbot** — `components/ui/ChatWidget.tsx` talks to an external chatbot service, with a message length cap, send cooldown, and per-session message limit to prevent abuse
- **Contact Form** — `app/contact/ContactForm.tsx` posts directly to Web3Forms, no backend mail service needed
- **Blog** — Markdown rendering via `marked`, categories/tags, related posts, view counts
- **Animations** — Framer Motion transitions plus custom UI touches (`GlitchLabel`, `TypeWriter`, `MatrixRain`, `ParallaxDots`, `HeroRipple`)
- **SEO** — `app/sitemap.ts` and `app/robots.ts` generated dynamically

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | Static site generation and routing |
| React 19 | UI framework |
| TypeScript | Type safety |
| Tailwind CSS 4 | Styling and responsive design |
| Framer Motion | Animations and transitions |
| lucide-react | Icon set |
| marked | Markdown rendering for blog content |
| Web3Forms | Contact form email delivery |

---

## Project Structure

```
frontend/
├── app/
│   ├── about/page.tsx
│   ├── blog/
│   │   ├── page.tsx          # Blog index
│   │   └── [slug]/page.tsx   # Single post
│   ├── contact/
│   │   ├── page.tsx
│   │   └── ContactForm.tsx   # Web3Forms submission
│   ├── experience/page.tsx
│   ├── projects/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── resume/page.tsx
│   ├── skills/page.tsx
│   ├── layout.tsx
│   ├── page.tsx               # Home page
│   ├── not-found.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Nav.tsx
│   └── ui/
│       ├── ChatWidget.tsx     # AI chatbot widget with spam prevention
│       ├── AnimateIn.tsx
│       ├── Badge.tsx
│       ├── BrandIcons.tsx
│       ├── Button.tsx
│       ├── CountUp.tsx
│       ├── GlitchLabel.tsx
│       ├── HeroPhoto.tsx
│       ├── HeroRipple.tsx
│       ├── MatrixRain.tsx
│       ├── ParallaxDots.tsx
│       └── TypeWriter.tsx
├── hooks/
├── lib/
│   ├── api.ts                 # Fetch wrapper for the backend API
│   ├── blog.ts                 # Blog data helpers
│   └── utils.ts
└── types/
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- The backend API running locally or a reachable API URL (see `../backend`)

### Install

```bash
npm install
```

### Configure environment

```bash
cp .env.example .env.local
```

Fill in the values (see Environment Variables below).

### Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

`.env.local`:

```env
# API base URL (no trailing slash)
# Local dev:   http://localhost:8000/v1
# Production:  https://api.josepaulotimbang.com/v1
NEXT_PUBLIC_API_URL=http://localhost:8000/v1
NEXT_PUBLIC_WEB3FORMS_KEY=your-web3forms-access-key
```

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL for all CodeIgniter API requests |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Access key for Web3Forms contact form submissions |
| `NEXT_PUBLIC_CHATBOT_URL` | Base URL for the AI chatbot service (defaults to the hosted `paulo-ai-chatbot` instance) |

---

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server at `localhost:3000` |
| `npm run build` | Static export build (outputs to `out/`) |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint |

---

## Deployment

Deployment is automated via `.github/workflows/deploy-frontend.yml` at the repo root: on push to `main` under `frontend/**`, GitHub Actions runs `npm ci && npm run build` with the production env vars injected, then rsyncs `frontend/out/` to Hostinger's `public_html` over SSH. See the [root README](../README.md#deployment-workflow) for the full pipeline and required secrets.

---

## License

This project was built for personal use as a portfolio site. Feel free to fork and adapt it for your own purposes.
