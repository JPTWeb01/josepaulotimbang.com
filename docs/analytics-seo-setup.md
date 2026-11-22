# Analytics & SEO setup

A reference for how Google Analytics 4, Google Search Console and the admin dashboard's **Analytics & SEO** tab are connected, plus the sitemap and pamangan.com steps.

## Contents

1. [How it fits together](#1-how-it-fits-together)
2. [Google Cloud: project, APIs and service account](#2-google-cloud-project-apis-and-service-account)
3. [Google Analytics 4: access and Property ID](#3-google-analytics-4-access-and-property-id)
4. [Search Console: add the site and give access](#4-search-console-add-the-site-and-give-access)
5. [Hostinger: key file and .env](#5-hostinger-key-file-and-env)
6. [Check the dashboard](#6-check-the-dashboard)
7. [Sitemap](#7-sitemap)
8. [pamangan.com](#8-pamangancom)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. How it fits together

| Piece | What it does | Where it lives |
|---|---|---|
| **GA4 tag** (`G-468EP5YNPJ`) | Records visitors and events on the site. It loads only after cookie consent. | `frontend/lib/analytics.ts` (override with `NEXT_PUBLIC_GA_ID`) |
| **Google Search Console** | Records how the site appears in Google search: queries, clicks, impressions and position | search.google.com/search-console |
| **Service account** | A "robot" Google account the backend uses to *read* GA4 and Search Console data | Google Cloud project `josepaulotimbang` |
| **Key file** | The service account's password, as a JSON file | Server only: `portfolio-api/writable/google/service-account.json` |
| **Analytics & SEO tab** | Shows GA4, Search Console and the site's own numbers in the admin dashboard | `backend/app/Controllers/Api/AnalyticsController.php`, `frontend/components/admin/Analytics.tsx` |

The service account currently in use is:

```
site-analytics@josepaulotimbang.iam.gserviceaccount.com
```

Whatever account the key file belongs to is the one that needs the APIs enabled and access granted. Mixing up two service accounts was the main setup problem. The dashboard's error messages always name the account in use.

Google results are cached for 10 minutes (live visitors: 1 minute). Click **Refresh** in the tab to fetch new numbers right away.

> **Never commit the key file or paste its contents anywhere.** It's a password for your Google data.

---

## 2. Google Cloud: project, APIs and service account

1. Go to **console.cloud.google.com** and sign in with the Google account that owns GA4 and Search Console.
2. Click the **project picker** at the top left and select the project **`josepaulotimbang`**. For a fresh setup, use **New Project** instead.
3. In the top search bar, open each of these and click **Enable**. If it shows "Manage", it's already on.
   - **Google Analytics Data API**
   - **Google Search Console API**
4. **Only if you need a new service account:** left menu ☰ → **IAM & Admin** → **Service Accounts** → **+ Create service account** → give it a name → **Create and continue** → skip the role steps → **Done**.
5. **To make a key:** click the service account's email → **Keys** tab → **Add key** → **Create new key** → **JSON** → **Create**. A `.json` file downloads.

The service account needs **no** Cloud roles. Access is granted inside GA4 and Search Console instead.

If key creation is blocked with "Key creation is disabled", that's an organization policy and needs a different approach.

---

## 3. Google Analytics 4: access and Property ID

1. Go to **analytics.google.com** → open the josepaulotimbang.com property → **Admin** (the gear icon, bottom left).
2. **Property access management** → blue **+** → **Add users**.
3. Paste the service account email, uncheck **Notify new users by email**, choose **Viewer**, then click **Add**.
4. Back in Admin → **Property details** → copy the **Property ID**. It's a number like `412345678`, **not** the `G-...` code.

---

## 4. Search Console: add the site and give access

### Add the site (once per website)

1. Go to **search.google.com/search-console** → property dropdown → **+ Add property**.
2. Choose **Domain**, enter the domain (e.g. `josepaulotimbang.com`) and click **Continue**. Then **Copy** the TXT value.
3. In **hPanel** → **Domains** → the domain → **DNS records**, add a record:
   - **Type:** TXT
   - **Name:** `@`
   - **Value:** the copied text

   Then click **Add Record**.
4. Back in Search Console, click **Verify**. If it fails, try again in 10–30 minutes.

### Give the service account access

1. Search Console → select the site → **Settings** → **Users and permissions** → **Add user**.
2. Paste the service account email, choose **Restricted**, then click **Add**.

### What to put in `SEARCH_CONSOLE_SITE`

Look at the property name in the dropdown:

| Dropdown shows | Property type | `SEARCH_CONSOLE_SITE` |
|---|---|---|
| `josepaulotimbang.com` | Domain | `sc-domain:josepaulotimbang.com` |
| `https://josepaulotimbang.com/` | URL prefix | `https://josepaulotimbang.com/` |

---

## 5. Hostinger: key file and .env

Server folder layout (from hPanel → **File Manager**):

```
domains/josepaulotimbang.com/
├── portfolio-api/            ← the backend app (NOT public)
│   ├── .env                  ← settings and secrets
│   └── writable/
│       └── google/
│           └── service-account.json   ← the key file goes here
└── public_html/              ← the public website (NOT here)
```

### Upload the key file

1. File Manager → `domains` → `josepaulotimbang.com` → `portfolio-api` → `writable` → `google`. The deploy creates this folder.
2. Click **Upload** and choose the downloaded JSON key.
3. Right-click it → **Rename** → exactly `service-account.json`.
   - Watch out for `service-account.json.json`. This happens easily because Windows hides extensions.
   - The name must be lowercase, use a dash rather than an underscore, and have no spaces.
4. Delete the JSON from your PC's Downloads folder once it's on the server.

### Add the settings to `.env`

In `domains/josepaulotimbang.com/portfolio-api/.env`, add each of these on **its own line**:

```
GA_PROPERTY_ID = 412345678
SEARCH_CONSOLE_SITE = sc-domain:josepaulotimbang.com
```

Optional: `GOOGLE_CREDENTIALS_FILE = path/to/key.json` points to a key file in a different location.

**If File Manager's Edit fails to save** with a red `403 Forbidden ... openresty` popup, Hostinger's firewall blocked it. Download `.env`, edit it in Notepad (**File → Save**, not "Save As"), then upload it back with **Replace**. Or use hPanel → **Advanced** → **SSH Access** → terminal → `nano domains/josepaulotimbang.com/portfolio-api/.env`. See also [admin-password.md](admin-password.md).

No redeploy is needed. The deploy workflow never overwrites `.env` or `writable/`.

---

## 6. Check the dashboard

1. Open the admin page → log in → **Analytics & SEO** tab → **Refresh**.
2. If something isn't connected, the tab says exactly what's missing or wrong. See [Troubleshooting](#9-troubleshooting).
3. GA4 is close to real-time. Search Console lags about **2 days**.

What the tab shows:

- **Google Analytics:** visitors, new users, sessions, page views, engagement, top pages, traffic channels and sources, countries, cities, devices, and live visitors.
- **Recruiter actions** (custom events sent by the site): resume downloads, contact forms sent, email link clicks, LinkedIn and GitHub clicks, chatbot opens and messages, and other outbound clicks.
- **Search Console:** clicks, impressions, CTR, average position, top search queries, pages, countries and devices.
- **From your site:** chatbot messages, job matches and jobs marked applied.

---

## 7. Sitemap

A sitemap is a list of the site's pages for Google. It helps Google find pages and notice updates, but it doesn't improve ranking by itself.

- **josepaulotimbang.com:** https://josepaulotimbang.com/sitemap.xml, generated automatically by `frontend/app/sitemap.ts`. New projects and blog posts are added on the next deploy. `robots.txt` (from `frontend/app/robots.ts`) points to it.
- **pamangan.com:** https://pamangan.com/sitemap.xml

### Submit it (once per site)

1. Search Console → choose the site in the dropdown → left menu → **Indexing** → **Sitemaps**.
2. In **Enter sitemap URL**, type the **full** address, e.g. `https://josepaulotimbang.com/sitemap.xml`.
   - For a Domain property the box has no prefix. Typing only `https://josepaulotimbang.com/` submits the homepage, and you get "1 error".
3. Click **Submit**. Within a day it should show **Status: Success** with the page count.

**To remove a wrong entry:** click the **row** to open its details, then click **⋮** at the very top right of the page → **Remove sitemap**. The ⋮ on the row in the list doesn't have this option. A wrong entry is harmless if left there.

---

## 8. pamangan.com

- Has GA4 (`G-9EXG0GJHF6`, loaded from its JavaScript) and a Google Cloud project **`pamangan-analytics`** with the Google Analytics Data API and Google Search Console API enabled.
- Its sitemap has been submitted to Search Console.
- **Not done yet (optional):** showing Search Console data in pamangan's own admin dashboard. That needs:
  1. In Search Console, adding pamangan's service account email (from `pamangan-analytics` → IAM & Admin → Service Accounts) as a **Restricted** user.
  2. Code changes in the separate `pamangan.com` repo.

---

## 9. Troubleshooting

| The tab says | Cause | Fix |
|---|---|---|
| "Missing: the service account key file" | The file isn't at `portfolio-api/writable/google/service-account.json` | Check the folder (not under `public_html`) and the exact file name. See [section 5](#5-hostinger-key-file-and-env). |
| "Missing: GA_PROPERTY_ID / SEARCH_CONSOLE_SITE in .env" | The `.env` change didn't save, or the line is glued onto another line | Re-check `.env`. Use download, edit and upload if Edit fails. |
| "Turn on the ... API in Google Cloud" | The API isn't enabled in the **service account's** project | Enable it in that project, not a different one, then wait ~5 minutes. |
| "No access yet ... add *email* as a Viewer / user" | That exact email has no access, or the ID/site is wrong | Add the **email shown in the message**. Check that `GA_PROPERTY_ID` is the number, not `G-...`. Check `sc-domain:` vs `https://`. |
| "Google sign-in for the service account failed" | The key file is damaged, or the key was deleted in Cloud | Create a new JSON key and upload it again. |
| Only zeros, no error | It's working, there just isn't much data yet | Wait. Search Console lags ~2 days. |
| Red `403 Forbidden ... openresty` popups in File Manager | Hostinger's firewall blocked saving the file | Download, edit and upload, or use SSH `nano`. |
