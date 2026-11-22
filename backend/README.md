# Backend — josepaulotimbang.com

The CodeIgniter 4 REST API behind [josepaulotimbang.com](https://josepaulotimbang.com). Today it powers the private admin dashboard at `/admin` (AI chatbot logs and job finder matches). The content endpoints (projects, skills, experience, blog) are included but not used by the live site yet.

---

## Introduction

This API backs the static Next.js frontend in `../frontend`. It's a single-admin system (no self-registration or multi-user roles): the site owner logs in with one set of credentials to get a JWT, then uses that token to create, update, and delete content. Everything else is public, read-only JSON.

See the [root README](../README.md) for the full-stack overview and deployment pipeline.

---

## Features

- **AI Chat Logs** — the chatbot service posts every exchange to `/v1/chat-logs` (shared `X-Ingest-Key`); the server adds the visitor's country from a local DB-IP database (no third-party lookup) and deletes logs older than 90 days
- **Job Finder Matches** — the job finder's daily GitHub Action posts its scored matches to `/v1/jobs/import`; the dashboard tracks new / saved / applied / hidden per job
- **Login Throttle** — 5 login attempts per minute per IP
- **Public Content API** — projects, skills, experience, and blog posts, with pagination, featured flags, and slug-based lookups
- **Blog Extras** — categories, tags, related-posts lookup, and per-post view-count increments
- **Contact Endpoint** — stores inbound messages to the database (in addition to the frontend's direct Web3Forms submission) with a read/unread admin inbox
- **JWT Auth** — single-admin login (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) issues a signed, expiring token; no session state on the server
- **Admin CRUD** — `/v1/admin/*` routes cover projects, posts, skills, experience, and message management, all behind `JwtFilter`
- **Consistent Response Envelope** — every response goes through `api_success` / `api_error` / `api_paginated` helpers for a uniform `{ success, message, data }` shape
- **Soft Deletes** — projects and posts use `deleted_at` instead of hard deletes
- **Health Check** — `GET /health` for uptime monitoring
- **CORS Allowlist** — configurable via `CORS_ORIGINS`, no wildcard origins

---

## Tech Stack

| Technology | Purpose |
|---|---|
| CodeIgniter 4 | REST API framework |
| PHP 8.2+ (intl, mysqli) | Runtime |
| firebase/php-jwt 7 | JWT issuing and verification |
| maxmind-db/reader | Reads the DB-IP Country Lite database |
| MySQLi | Database driver |
| PHPUnit + fakerphp/faker | Testing (dev dependency) |

---

## Project Structure

```
backend/
├── app/
│   ├── Config/
│   │   ├── App.php          # Base URL, environment settings
│   │   ├── Boot/
│   │   │   ├── development.php
│   │   │   └── production.php
│   │   ├── Cors.php         # Allowed origins, headers, methods
│   │   ├── Database.php     # DB connection config
│   │   ├── Filters.php      # Registers the jwt filter
│   │   └── Routes.php       # All API route definitions
│   ├── Controllers/Api/
│   │   ├── AuthController.php        # Single-admin login, issues JWT
│   │   ├── ContactController.php     # Store + admin inbox for messages
│   │   ├── ExperienceController.php  # Work experience CRUD
│   │   ├── PostController.php        # Blog posts, categories, tags
│   │   ├── ProjectController.php     # Projects CRUD
│   │   └── SkillController.php       # Skills CRUD
│   ├── Controllers/Api/ChatLogController.php  # Chat log ingest + admin list/stats/delete
│   ├── Controllers/Api/JobController.php      # Job import + admin list/status
│   ├── Database/Migrations/                   # chat_logs table
│   ├── Libraries/GeoIp.php                    # IP → country (writable/geoip/*.mmdb)
│   ├── Filters/
│   │   ├── IngestKeyFilter.php  # Checks X-Ingest-Key on ingest routes
│   │   └── JwtFilter.php    # Verifies Bearer token on /v1/admin/* routes
│   ├── Helpers/
│   │   └── response_helper.php  # api_success() / api_error() / api_paginated()
│   └── Models/
│       ├── CategoryModel.php
│       ├── ContactModel.php
│       ├── ExperienceModel.php
│       ├── PostModel.php
│       ├── ProjectModel.php
│       └── SkillModel.php
├── public/
│   └── index.php            # Front controller
├── writable/
│   ├── cache/
│   └── logs/
└── composer.json
```

---

## Getting Started

### Prerequisites

- PHP 8.2+ (intl, mysqli) and Composer
- MySQL database

### Install

```bash
composer install
```

### Configure environment

```bash
cp .env.example .env
```

Fill in the values (see Environment Variables below).

### Set up the database

```bash
php spark migrate --all
```

For country lookups, download the free [DB-IP Country Lite](https://db-ip.com/db/download/ip-to-country-lite) `.mmdb` and save it as `writable/geoip/dbip-country-lite.mmdb` (the deploy workflow does this monthly). Without it, the country is left blank.

### Run the dev server

```bash
php spark serve
```

The API will be available at `http://localhost:8000`.

---

## Environment Variables

`.env`:

```env
CI_ENVIRONMENT = development

app.baseURL = 'http://localhost:8000'
app.forceGlobalSecureRequests = false

database.default.hostname = localhost
database.default.database = portfolio_db
database.default.username = root
database.default.password =
database.default.DBDriver = MySQLi
database.default.DBPrefix =
database.default.port = 3306

# Admin login (password is a bcrypt hash, not the plain password)
ADMIN_EMAIL = you@example.com
ADMIN_PASSWORD = $2y$10$...

# JWT — at least 32 random characters
JWT_SECRET =
JWT_TTL = 28800

# Shared key for the chatbot and job finder (at least 32 characters)
INGEST_KEY =

# CORS — comma-separated allowed origins
CORS_ORIGINS = http://localhost:3000,https://josepaulotimbang.com

# Contact — email notifications (optional)
MAIL_FROM = noreply@josepaulotimbang.com
MAIL_TO = contactme@josepaulotimbang.com
```

| Variable | Purpose |
|---|---|
| `app.baseURL` | Base URL used to build absolute links and the JWT `iss` claim |
| `database.default.*` | MySQL connection settings |
| `JWT_SECRET` | Secret used to sign JWT tokens — keep this random and private |
| `JWT_TTL` | Token lifespan in seconds (28800 = 8 hours) |
| `INGEST_KEY` | Shared secret the chatbot and job finder send in `X-Ingest-Key` |
| `CORS_ORIGINS` | Comma-separated origins allowed to call the API. Only needed for local development; in production the dashboard calls `/api` on the same domain |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Single-admin login credentials checked by `AuthController::login` (password must be a bcrypt hash) |

---

## API Reference

### Public — `/v1`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/v1/projects` | Paginated published projects |
| GET | `/v1/projects/featured` | Featured projects |
| GET | `/v1/projects/{slug}` | Single project |
| GET | `/v1/skills` | All skills |
| GET | `/v1/experience` | All experience entries |
| GET | `/v1/posts` | Paginated published posts |
| GET | `/v1/posts/featured` | Featured posts |
| GET | `/v1/posts/{slug}` | Single post |
| GET | `/v1/posts/related/{slug}` | Related posts |
| POST | `/v1/posts/{slug}/view` | Increment view count |
| GET | `/v1/categories` | Blog categories |
| GET | `/v1/tags` | Blog tags |
| POST | `/v1/contact` | Submit a contact message |
| POST | `/v1/auth/login` | Admin login, returns a JWT |
| POST | `/v1/auth/logout` | Stateless — client discards the token |

### Ingest — `/v1` (requires `X-Ingest-Key`)

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/v1/chat-logs` | One chatbot exchange: `ip`, `message`, `reply`, optional `session_id`, `page`, `site`, `user_agent` |
| POST | `/v1/jobs/import` | JSON array of job matches (replaces the stored list; statuses are kept) |

### Admin — `/v1/admin` (requires `Authorization: Bearer <jwt>`)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/v1/admin/chats` | Chat logs; filters `from`, `to` (UTC), `country`, `ip` (prefix), `session`, `q`, `page`, `per_page` |
| GET | `/v1/admin/chats/stats` | Totals, top countries, messages per day (same filters) |
| DELETE | `/v1/admin/chats/{id}` | Delete one chat log |
| GET | `/v1/admin/jobs` | Job matches with their status |
| POST | `/v1/admin/jobs/status` | `{ id, status }` — `new`, `saved`, `applied`, `hidden` |
| GET | `/v1/admin/messages` | List contact messages |
| PATCH | `/v1/admin/messages/{id}/read` | Mark a message read |
| DELETE | `/v1/admin/messages/{id}` | Delete a message |
| GET/POST/PUT/DELETE | `/v1/admin/projects` (`/{id}`) | Projects CRUD |
| GET/POST/PUT/DELETE | `/v1/admin/posts` (`/{id}`) | Posts CRUD |
| GET/POST/PUT/DELETE | `/v1/admin/skills` (`/{id}`) | Skills CRUD |
| GET/POST/PUT/DELETE | `/v1/admin/experience` (`/{id}`) | Experience CRUD |

All responses follow `{ success: boolean, message?: string, data?: any, errors?: any }`. Paginated list endpoints return `data: { items, total, page, per_page, total_pages }`.

---

## Deployment

`.github/workflows/deploy-backend.yml` deploys on every push to `main` that touches `backend/`, and once a month to refresh the GeoIP database. It uses the same SSH secrets as the frontend workflow.

| Server path | Contents |
|---|---|
| `domains/josepaulotimbang.com/portfolio-api/` | App, vendor, `writable/`, `.env` — outside the web root |
| `domains/josepaulotimbang.com/public_html/api/` | Only `index.php` and `.htaccess`, served at `https://josepaulotimbang.com/api` |

`public/index.php` loads `../app` when run from this repo and `../../portfolio-api/app` on the server. The frontend workflow excludes `/api` from its `rsync --delete`.

One-time setup on Hostinger:

1. Set the domain's PHP version to 8.2 or newer.
2. Create a MySQL database and user.
3. Create `portfolio-api/.env` on the server with `CI_ENVIRONMENT = production`, `app.baseURL = 'https://josepaulotimbang.com/api/'`, the database settings, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (hash), `JWT_SECRET` and `INGEST_KEY`. Generate values with:

   ```bash
   php -r "echo password_hash('your-password', PASSWORD_DEFAULT), PHP_EOL;"
   php -r "echo bin2hex(random_bytes(32)), PHP_EOL;"   # run twice: JWT_SECRET and INGEST_KEY
   ```

4. Run the workflow (or push). It runs `php spark migrate --all` once `.env` exists. If the server's CLI `php` is older than 8.2, set the repository variable `PHP_BIN` (for example `/opt/alt/php83/usr/bin/php`).

---

## Security Notes

- Single-admin auth only — there is no user registration, and admin credentials should never be committed
- `JwtFilter` rejects requests with a missing, expired, or invalid-signature token before they reach the controller
- Ingest routes need `X-Ingest-Key`, compared in constant time; `JWT_SECRET` shorter than 32 characters is refused
- The app, `.env` and `writable/` live outside `public_html`; only the front controller is web-reachable
- CORS is an explicit allowlist (`CORS_ORIGINS`), not a wildcard
- `.env` is gitignored — secrets never committed to the repository

---

## License

This project was built for personal use as a portfolio API. Feel free to fork and adapt it for your own purposes.
