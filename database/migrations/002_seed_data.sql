-- Seed data for local development
USE portfolio_db;

-- ─── Skills ────────────────────────────────────────────────────────────────
INSERT INTO skills (name, category, level, sort_order) VALUES
  ('Next.js',       'Frontend',            90,  1),
  ('React',         'Frontend',            90,  2),
  ('TypeScript',    'Frontend',            85,  3),
  ('Tailwind CSS',  'Frontend',            85,  4),
  ('Framer Motion', 'Frontend',            75,  5),
  ('HTML / CSS',    'Frontend',            95,  6),

  ('PHP',           'Backend',             85,  1),
  ('CodeIgniter 4', 'Backend',             85,  2),
  ('Node.js',       'Backend',             70,  3),
  ('REST API',      'Backend',             90,  4),
  ('MySQL',         'Backend',             80,  5),
  ('PostgreSQL',    'Backend',             65,  6),

  ('Claude API',    'AI / ML',             75,  1),
  ('OpenAI API',    'AI / ML',             70,  2),
  ('LangChain',     'AI / ML',             55,  3),
  ('Vector DBs',    'AI / ML',             50,  4),

  ('Git / GitHub',  'Tools & DevOps',      90,  1),
  ('Docker',        'Tools & DevOps',      55,  2),
  ('Vercel',        'Tools & DevOps',      85,  3),
  ('Linux / CLI',   'Tools & DevOps',      75,  4),
  ('VS Code',       'Tools & DevOps',      95,  5),

  ('Figma',         'Design & Collab',     70,  1),
  ('Notion',        'Design & Collab',     80,  2),
  ('Jira',          'Design & Collab',     70,  3);

-- ─── Experiences ───────────────────────────────────────────────────────────
INSERT INTO experiences (company, role, employment_type, start_date, end_date, current, description, tech_used, sort_order) VALUES
  (
    'Freelance',
    'Full-Stack Developer',
    'Freelance',
    '2023-01-01', NULL, 1,
    'Building full-stack web applications for clients. Specialising in React/Next.js frontends with PHP backends.',
    '["Next.js","React","TypeScript","CodeIgniter 4","MySQL"]',
    1
  ),
  (
    'Pasig City Government',
    'IT Support Specialist',
    'Full-time',
    '2021-06-01', '2022-12-31', 0,
    'Provided technical support, maintained internal systems, and assisted in digitising government services.',
    '["PHP","MySQL","HTML","CSS","JavaScript"]',
    2
  ),
  (
    'Self-Employed',
    'Web Developer',
    'Part-time',
    '2020-01-01', '2021-05-31', 0,
    'Developed WordPress sites and custom landing pages for small businesses.',
    '["WordPress","PHP","HTML","CSS","jQuery"]',
    3
  );

-- ─── Categories ────────────────────────────────────────────────────────────
INSERT INTO categories (name, slug) VALUES
  ('Web Development',    'web-development'),
  ('AI & Machine Learning', 'ai-ml'),
  ('Career',             'career'),
  ('Tutorial',           'tutorial');

-- ─── Tags ──────────────────────────────────────────────────────────────────
INSERT INTO tags (name, slug) VALUES
  ('Next.js',      'nextjs'),
  ('React',        'react'),
  ('TypeScript',   'typescript'),
  ('PHP',          'php'),
  ('CodeIgniter',  'codeigniter'),
  ('AI',           'ai'),
  ('Tutorial',     'tutorial'),
  ('Career',       'career');

-- ─── Sample blog post ──────────────────────────────────────────────────────
INSERT INTO posts (title, slug, excerpt, content, status, featured, read_time, published_at, created_at, updated_at)
VALUES (
  'Building a Portfolio with Next.js 16 and CodeIgniter 4',
  'building-portfolio-nextjs-codeigniter',
  'A step-by-step breakdown of how I rebuilt my portfolio using the latest Next.js 16 with App Router and a CodeIgniter 4 REST API backend.',
  '## Why This Stack?

Next.js 16 with the App Router gives us React Server Components by default — meaning less JavaScript shipped to the browser and faster page loads. Paired with a CodeIgniter 4 REST API, I get a typed, maintainable PHP backend that I am already comfortable with.

## Setting Up the Next.js Frontend

```bash
npx create-next-app@latest frontend --typescript --tailwind --app
```

Tailwind CSS v4 changes the configuration approach: instead of `tailwind.config.ts`, all design tokens live inside a `@theme inline {}` block in your CSS file.

## The CodeIgniter 4 Backend

CodeIgniter 4 is a lightweight PHP MVC framework. The REST API exposes JSON endpoints consumed by the Next.js frontend.

```php
// app/Controllers/Api/ProjectController.php
public function index(): ResponseInterface
{
    return api_success($this->model->getFeatured());
}
```

## Deployment

The frontend exports as a static site (`output: "export"`) and is hosted on Hostinger shared hosting. The API runs on a subdomain `api.josepaulotimbang.com` via the same Hostinger account with PHP support.

## Conclusion

This stack balances performance, developer experience, and cost. Static Next.js means near-zero hosting costs for the frontend while CodeIgniter keeps the backend familiar and fast.',
  'published', 1, 6,
  '2026-06-01 09:00:00',
  NOW(), NOW()
);

-- Attach category and tag to the sample post
INSERT INTO post_categories (post_id, category_id)
SELECT p.id, c.id FROM posts p, categories c
WHERE p.slug = 'building-portfolio-nextjs-codeigniter'
  AND c.slug IN ('web-development', 'tutorial');

INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id FROM posts p, tags t
WHERE p.slug = 'building-portfolio-nextjs-codeigniter'
  AND t.slug IN ('nextjs', 'react', 'typescript', 'php', 'codeigniter');

-- ─── Sample project ────────────────────────────────────────────────────────
INSERT INTO projects (title, slug, description, long_description, tech_stack, category, status, live_url, github_url, featured, sort_order, created_at, updated_at)
VALUES (
  'Pamangan',
  'pamangan',
  'AI-powered Filipino recipe platform that generates personalised recipes based on available ingredients using Claude AI.',
  'Pamangan is a full-stack AI recipe generation platform built to address food accessibility in Filipino households. Users input ingredients they have on hand and the AI generates a culturally authentic recipe, step-by-step instructions, and nutritional information.',
  '["Next.js","TypeScript","Tailwind CSS","CodeIgniter 4","MySQL","Claude AI"]',
  'AI / Full-Stack',
  'active',
  'https://pamangan.com',
  'https://github.com/josepaulotimbang/pamangan',
  1, 1,
  NOW(), NOW()
),
(
  'DevQuiz',
  'devquiz',
  'Developer quiz platform with AI-generated questions covering JavaScript, TypeScript, React, and more.',
  'DevQuiz generates fresh quiz questions using Claude AI, ensuring questions stay current with the latest frameworks and best practices. Features spaced repetition, leaderboards, and category filters.',
  '["Next.js","TypeScript","Tailwind CSS","Node.js","PostgreSQL","Claude AI"]',
  'AI / Full-Stack',
  'active',
  NULL,
  'https://github.com/josepaulotimbang/devquiz',
  1, 2,
  NOW(), NOW()
),
(
  'Paulo AI Chatbot',
  'paulo-ai-chatbot',
  'Personal AI assistant trained on my portfolio, projects, and background — so recruiters can get instant answers.',
  'An embedded AI chatbot that knows my entire professional history, projects, and skills. Powered by the Claude API with a custom system prompt, it answers recruiter questions in real time.',
  '["Next.js","TypeScript","Tailwind CSS","Claude API","Vercel"]',
  'AI',
  'active',
  'https://josepaulotimbang.com',
  NULL,
  1, 3,
  NOW(), NOW()
);
