# Backend — josepaulotimbang.com

The CodeIgniter 4 REST API powering [josepaulotimbang.com](https://josepaulotimbang.com) — serves public content (projects, skills, experience, blog) and a JWT-protected admin surface for managing it.

---

## Introduction

This API backs the static Next.js frontend in `../frontend`. It's a single-admin system (no self-registration or multi-user roles): the site owner logs in with one set of credentials to get a JWT, then uses that token to create, update, and delete content. Everything else is public, read-only JSON.

See the [root README](../README.md) for the full-stack overview and deployment pipeline.

---

## Features

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
| PHP 8.1+ | Runtime |
| firebase/php-jwt | JWT issuing and verification |
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
│   ├── Filters/
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

- PHP 8.1+ and Composer
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
mysql -u root -p < ../database/migrations/001_create_tables.sql
mysql -u root -p portfolio_db < ../database/migrations/002_seed_data.sql
```

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

# JWT
JWT_SECRET = your-super-secret-jwt-key-change-this-in-production
JWT_TTL = 86400

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
| `JWT_TTL` | Token lifespan in seconds (86400 = 24 hours) |
| `CORS_ORIGINS` | Comma-separated origins allowed to call the API |
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

### Admin — `/v1/admin` (requires `Authorization: Bearer <jwt>`)

| Method | Endpoint | Purpose |
|---|---|---|
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

No CI pipeline yet — deploy by pulling the latest code onto the Hostinger server and running:

```bash
composer install --no-dev --optimize-autoloader
```

Set `CI_ENVIRONMENT = production` in the server's `.env` and confirm `app.baseURL`, `CORS_ORIGINS`, and JWT/admin credentials are production values. See the [root README](../README.md#deployment-workflow) for how this fits into the overall deployment.

---

## Security Notes

- Single-admin auth only — there is no user registration, and admin credentials should never be committed
- `JwtFilter` rejects requests with a missing, expired, or invalid-signature token before they reach the controller
- CORS is an explicit allowlist (`CORS_ORIGINS`), not a wildcard
- `.env` is gitignored — secrets never committed to the repository

---

## License

This project was built for personal use as a portfolio API. Feel free to fork and adapt it for your own purposes.
