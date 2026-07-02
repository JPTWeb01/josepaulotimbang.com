export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  published_at: string;
  read_time: number;
  categories: string[];
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "rebuilding-portfolio-nextjs-cicd",
    title: "Rebuilding My Portfolio: WordPress to a Custom Next.js CI/CD Pipeline",
    excerpt:
      "I rebuilt josepaulotimbang.com from a WordPress install into a custom Next.js 16 static site with its own GitHub Actions deploy pipeline — including a real production mistake that taught me more about rsync than any tutorial could.",
    published_at: "2026-07-01",
    read_time: 7,
    cover_image: null,
    categories: ["Projects", "DevOps"],
    tags: ["Next.js", "TypeScript", "GitHub Actions", "SSH", "Hostinger", "CI/CD"],
    content: `
## Why Leave WordPress

This site started on WordPress, like most of my early client work. It did the job, but it wasn't really *mine* — theme constraints, plugin bloat, and a database dependency for what is fundamentally a handful of static pages. I wanted something I fully controlled: a codebase I could version, animate, and deploy exactly the way I wanted.

So I rebuilt it from scratch on Next.js 16 — React 19, TypeScript, Tailwind CSS, static export — and used the rebuild as an excuse to actually learn the deploy pipeline properly instead of dragging files over FTP.

## The New Stack

The frontend is a fully static export (\`output: "export"\` in \`next.config.ts\`), which means no Node server needed on the host — just files served directly by Hostinger. That simplicity is the whole point: fast, cheap, and nothing to patch or keep alive.

I used the rebuild to add some personality to the homepage too — a matrix-rain canvas effect, a cursor-reactive dot-grid parallax, a typewriter role rotation, and animated stat counters. All gated behind \`prefers-reduced-motion\` checks, because flashy shouldn't come at the cost of accessibility.

## Splitting Into Its Own Repository

The project had been living as a subfolder inside a larger monorepo alongside unrelated projects. That's awkward for CI: GitHub Actions workflows expect to live at a repo root, and having multiple unrelated projects sharing one repo means every push triggers path-filtering gymnastics.

The fix was \`git subtree split\`:

\`\`\`bash
git subtree split --prefix=josepaulotimbang.com -b jpt-standalone
git push https://github.com/JPTWeb01/josepaulotimbang.com.git jpt-standalone:main
\`\`\`

This rewrites history so every commit that ever touched that subfolder becomes a normal commit at a new root — full history preserved, nothing squashed, but now it's a real standalone repository matching how my other projects are already set up.

## From FTP to SSH

The old deploy workflow used \`FTP-Deploy-Action\` — plaintext credentials, no encryption, and honestly no reason to still be using FTP in 2026. I switched it to \`rsync\` over SSH with a dedicated ed25519 deploy key:

\`\`\`yaml
- name: Deploy via rsync over SSH
  run: |
    rsync -avz --delete \\
      -e "ssh -i ~/.ssh/deploy_key -p $SSH_PORT -o StrictHostKeyChecking=no" \\
      frontend/out/ \\
      "$SSH_USERNAME@$SSH_HOST:$DEPLOY_PATH/"
\`\`\`

Key-based auth, scoped to exactly one deploy key that only exists in GitHub's encrypted secrets and Hostinger's authorized keys. Nothing else needed it.

## The Mistake That Taught Me the Most

Here's the part I almost didn't write about, but it's the most useful lesson from this whole rebuild.

My Hostinger account hosts multiple projects under one domain's document root — \`domains/josepaulotimbang.com/public_html/\` isn't just this site, it also contains \`devquiz/\` and \`wordpress/\` as subfolders for two subdomains. I pointed the new deploy at that shared folder using \`rsync --delete\`, which — by design — deletes anything in the destination that isn't part of the current build output.

I didn't account for the fact that "the destination" was a *shared* folder. The very next deploy wiped out both sibling projects, because neither exists in this project's build output. Lesson learned the expensive way: **\`--delete\` doesn't know about your other projects — it only knows about your source and your destination.**

The fix was straightforward once I saw the actual damage:

\`\`\`bash
rsync -avz --delete \\
  --exclude=/devquiz \\
  --exclude=/wordpress \\
  -e "ssh -i ~/.ssh/deploy_key -p $SSH_PORT -o StrictHostKeyChecking=no" \\
  frontend/out/ \\
  "$SSH_USERNAME@$SSH_HOST:$DEPLOY_PATH/"
\`\`\`

rsync's exclude rules apply to deletions too, by default — no extra flag needed. DevQuiz recovered cleanly by re-running its own independent deploy workflow. The real fix wasn't the \`--exclude\` flags themselves, though — it was learning to actually map out what else lives in a shared destination *before* pointing a destructive flag at it, not after.

## Fixing the Contact Form

One more subtle bug: the contact form (Web3Forms) kept failing silently in production. The cause was a static-export-specific gotcha — environment variables have to be baked in at **build time**, since there's no server at runtime to read them from:

\`\`\`yaml
- name: Build static export
  env:
    NEXT_PUBLIC_WEB3FORMS_KEY: \${{ secrets.NEXT_PUBLIC_WEB3FORMS_KEY }}
  run: npm run build
\`\`\`

Miss that step and the key compiles in as an empty string — the form submits, Web3Forms rejects it, and the failure is silent unless you're specifically checking. A good reminder that static exports trade server flexibility for exactly this kind of build-time rigidity.

## What I Learned

**1. \`git subtree split\` is the right tool for de-monorepo-ing a project.** Full history, clean root, no manual file surgery.

**2. Prefer SSH keys over any password-based deploy method.** Scoped, revocable, and it's what CI should be using in the first place.

**3. Never point a destructive rsync flag at a directory you don't fully control.** Map out what else lives there first — sibling subdomains, shared uploads, anything not tracked by *your* build.

**4. Static exports need their secrets baked in at build time, not runtime.** If a static site's feature depends on an env var, it belongs in the build step, not just "somewhere in CI."

The site is faster, fully version-controlled, and deploys in about a minute from a clean \`git push\`. Worth the rebuild — and worth the mistake, since I won't make that particular one again.
    `.trim(),
  },
  {
    slug: "building-pamangan-ai-recipe-platform",
    title: "Building pamangan.com: An AI-Powered Recipe Platform",
    excerpt:
      "How I designed and built a full-stack AI recipe platform celebrating Filipino cuisine — from architecture decisions to AI fallback logic and production deployment.",
    published_at: "2026-05-15",
    read_time: 8,
    cover_image: null,
    categories: ["Projects", "AI Engineering"],
    tags: ["React", "Flask", "MongoDB", "Gemini AI", "Python"],
    content: `
## The Idea

Filipino cuisine is underrepresented online. Most recipe platforms focus on Western food, and AI-powered tools are even worse. I wanted to build something that celebrated Filipino food — and used it as an opportunity to learn AI integration in a production context.

pamangan.com was born from that goal: a full-stack recipe platform where you can search existing recipes, generate new ones via AI, build grocery lists, and get nutritional breakdowns — all powered by Google Gemini with a Groq fallback.

## Architecture Decisions

The first major decision was the database strategy. Rather than calling the AI on every search, I implemented a **database-first** approach:

1. Search MongoDB text index for the query
2. If found → return from DB immediately (fast, free)
3. If not found → call Gemini AI to generate the recipe
4. Save the AI result to DB (so the next search hits the cache)

This design cut AI API costs dramatically while making the app feel fast.

\`\`\`python
def search_recipe(query: str) -> dict:
    # Try DB first
    cached = recipe_service.search_by_name(query)
    if cached:
        return cached

    # Fall back to AI generation
    recipe = ai_service.generate_recipe(query)
    recipe_service.save(recipe)
    return recipe
\`\`\`

## The AI Fallback System

Gemini is excellent but not 100% reliable — rate limits, timeouts, and API errors happen. Rather than showing users an error, I built a transparent fallback to Groq's llama-3.1-8b-instant model:

\`\`\`python
def generate_recipe(dish_name: str) -> dict:
    try:
        return self._call_gemini(dish_name)
    except Exception:
        return self._call_groq(dish_name)  # Silent fallback
\`\`\`

The user never sees an error message. They just get a recipe — from whichever provider worked.

## What I Learned

**1. AI reliability is not guaranteed.** Design for graceful fallback from day one. Never let a single provider failure surface to the user.

**2. Cache aggressively.** Every AI-generated recipe gets saved. The second person to search for "Adobo" gets an instant database result, not an API call.

**3. Separation of concerns saves you.** By keeping AI logic in \`ai_service.py\`, I could swap providers, add fallbacks, and tune prompts without touching any route handlers.

**4. MongoDB text indexes are powerful.** A properly indexed search across name, cuisine, and tags is fast enough to be invisible to users.

## Deployment

- Frontend: React static build → Hostinger (rsync via GitHub Actions)
- Backend: Flask on Koyeb (free tier)
- Database: MongoDB Atlas (free M0 cluster)

The whole production stack costs $0/month beyond the Hostinger domain.
    `.trim(),
  },
  {
    slug: "transitioning-to-ai-engineering",
    title: "Why I'm Transitioning from Web Dev to AI Engineering",
    excerpt:
      "The web is getting smarter. Here's why I decided to add AI engineering to my skillset, what that journey looks like from a self-taught developer's perspective, and the projects I'm building along the way.",
    published_at: "2026-04-10",
    read_time: 5,
    cover_image: null,
    categories: ["Career", "AI Engineering"],
    tags: ["AI", "Career", "Learning", "OpenAI", "Python"],
    content: `
## The Shift I Noticed

In 2024, something changed in client conversations. Projects that used to be pure CRUD apps started having a new question attached: "Can we add AI to this?"

At first I thought it was hype. But the requests kept coming — AI-generated summaries, chatbots, content classification, recommendation engines. The market was moving, and I needed to move with it.

## What "AI Engineering" Actually Means

AI Engineering is different from Machine Learning. ML engineers build models. AI engineers integrate existing models into products.

As a web developer, I already had the infrastructure skills:
- Building APIs that serve data
- Managing state in frontend apps
- Deploying and monitoring production systems

What I needed to add:
- Working with LLM APIs (OpenAI, Gemini, Groq)
- Prompt engineering — the craft of getting reliable outputs
- Retrieval-Augmented Generation (RAG) for knowledge-grounded responses
- Understanding token limits, context windows, and costs

## The Learning Path I Followed

I didn't take a course. I built things.

**Step 1 — Paulo AI Chatbot**
Built a basic chatbot with the OpenAI API. Learned: streaming responses, conversation history, token counting, and the basics of prompt design.

**Step 2 — pamangan.com AI Integration**
Added AI recipe generation to a real production app. Learned: provider fallback logic, response parsing, cost management, and caching AI outputs.

**Step 3 — Now: RAG and Agents**
Currently studying vector databases and LangChain. The goal is to build an AI assistant that can answer questions about my own portfolio and projects.

## The Hard Parts

**Prompts are code.** A poorly written prompt gives you garbage output. You have to engineer prompts with the same rigor as functions — test them, version them, iterate.

**Costs are real.** Every API call costs money. Design for caching. Design for fallbacks. Don't call AI when a database query will do.

**The outputs are non-deterministic.** Unlike a function that returns the same result for the same input, LLMs don't. You need validation layers and graceful error handling.

## Where I'm Going

My goal is to become a full-stack AI engineer — someone who can build the web application *and* integrate the intelligence layer. Not a data scientist, not a pure frontend dev. The engineer who can do both.

The demand for that skill set is only going to grow.
    `.trim(),
  },
  {
    slug: "codeigniter-to-flask-backend-journey",
    title: "PHP to Python: Switching Backend Languages Mid-Career",
    excerpt:
      "I spent years building backends in PHP and CodeIgniter. Then I learned Python and Flask for AI projects. Here's what's different, what's the same, and what I'd tell myself if I were starting over.",
    published_at: "2026-03-02",
    read_time: 6,
    cover_image: null,
    categories: ["Web Development", "Backend"],
    tags: ["PHP", "Python", "CodeIgniter", "Flask", "Backend"],
    content: `
## Background

My first real backend was PHP. I learned it because it ran on cheap shared hosting, every tutorial used it, and CodeIgniter made MVC make sense to a self-taught developer.

By the time I needed a backend for an AI project, Python was the obvious choice — the AI ecosystem lives there. So I learned Flask. Here's what I found.

## What's the Same

**MVC is MVC.** The pattern is the same: a router maps URLs to controllers, controllers call models, models talk to the database, and you return a response. Whether it's CodeIgniter or Flask, this mental model transfers completely.

**REST is REST.** GET, POST, PUT, DELETE. JSON request bodies, JSON responses, HTTP status codes. None of this is language-specific.

**The debugging process is identical.** Read the error, find the line, fix it. The error messages look different but the debugging loop is the same.

## What's Different

### Syntax
PHP requires \`$\` prefixes, semicolons, and has verbose array syntax. Python is minimal by comparison:

\`\`\`php
// PHP / CodeIgniter
public function getRecipes() {
    $recipes = $this->recipeModel->findAll();
    return $this->response->setJSON(['data' => $recipes]);
}
\`\`\`

\`\`\`python
# Python / Flask
@app.route('/api/recipes')
def get_recipes():
    recipes = Recipe.find_all()
    return jsonify({'data': recipes})
\`\`\`

Python wins on readability every time.

### The Ecosystem
CodeIgniter is batteries-included. ORM, validation, sessions, email — all built in. Flask is minimal by design. You bring your own ORM (SQLAlchemy), your own validation (marshmallow), your own JWT library.

This is a genuine trade-off. CodeIgniter gets you moving faster. Flask is more flexible but requires more setup.

### AI Integration
This is where Python dominates. The official SDKs for OpenAI, Google Gemini, Anthropic, and Groq are all Python-first. You can do AI in PHP, but it's fighting the current.

\`\`\`python
import google.generativeai as genai

model = genai.GenerativeModel('gemini-1.5-flash')
response = model.generate_content(f"Generate a recipe for {dish_name}")
\`\`\`

Three lines. That's why I use Python for AI work.

## My Current Stack

- **Portfolio API:** CodeIgniter 4 on Hostinger (PHP is what the hosting supports)
- **AI Projects:** Flask on cloud hosting (Python for AI ecosystem access)

I don't think of them as competing. They're tools for different jobs. PHP is excellent for hosting-constrained environments with structured data. Python is essential for anything touching AI.

## What I'd Tell Myself

Don't wait until you "know PHP well enough" to learn Python. The concepts transfer. The syntax difference is smaller than you think. And the Python ecosystem — especially for AI work — is worth the investment.

Start with Flask and build something real. You'll be productive within a week.
    `.trim(),
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAllCategories(): string[] {
  const cats = new Set(blogPosts.flatMap((p) => p.categories));
  return Array.from(cats).sort();
}

export function getRelatedPosts(slug: string, limit = 2): BlogPost[] {
  const current = getPost(slug);
  if (!current) return [];
  return blogPosts
    .filter(
      (p) =>
        p.slug !== slug &&
        p.categories.some((c) => current.categories.includes(c))
    )
    .slice(0, limit);
}
