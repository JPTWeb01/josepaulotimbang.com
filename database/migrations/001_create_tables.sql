-- Portfolio database schema
-- Run: mysql -u root -p portfolio_db < database/migrations/001_create_tables.sql

CREATE DATABASE IF NOT EXISTS portfolio_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE portfolio_db;

-- ─── Projects ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title            VARCHAR(255)  NOT NULL,
  slug             VARCHAR(255)  NOT NULL UNIQUE,
  description      TEXT          NOT NULL,
  long_description LONGTEXT,
  tech_stack       JSON,
  category         VARCHAR(100),
  status           ENUM('active','completed','archived') NOT NULL DEFAULT 'active',
  live_url         VARCHAR(512),
  github_url       VARCHAR(512),
  image_url        VARCHAR(512),
  featured         TINYINT(1)    NOT NULL DEFAULT 0,
  sort_order       SMALLINT      NOT NULL DEFAULT 0,
  created_at       DATETIME,
  updated_at       DATETIME,
  deleted_at       DATETIME,
  INDEX idx_slug    (slug),
  INDEX idx_featured (featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Skills ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  category   VARCHAR(100) NOT NULL,
  level      TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '0-100 proficiency',
  sort_order SMALLINT     NOT NULL DEFAULT 0,
  created_at DATETIME,
  updated_at DATETIME,
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Experiences ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS experiences (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company         VARCHAR(255) NOT NULL,
  role            VARCHAR(255) NOT NULL,
  employment_type VARCHAR(50)  NOT NULL DEFAULT 'Full-time',
  start_date      DATE         NOT NULL,
  end_date        DATE,
  current         TINYINT(1)   NOT NULL DEFAULT 0,
  description     TEXT,
  tech_used       JSON,
  sort_order      SMALLINT     NOT NULL DEFAULT 0,
  created_at      DATETIME,
  updated_at      DATETIME,
  INDEX idx_current (current)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Blog posts ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(255) NOT NULL,
  slug         VARCHAR(255) NOT NULL UNIQUE,
  excerpt      TEXT,
  content      LONGTEXT     NOT NULL,
  cover_image  VARCHAR(512),
  status       ENUM('draft','published') NOT NULL DEFAULT 'draft',
  featured     TINYINT(1)   NOT NULL DEFAULT 0,
  read_time    TINYINT UNSIGNED NOT NULL DEFAULT 5,
  view_count   INT UNSIGNED NOT NULL DEFAULT 0,
  published_at DATETIME,
  created_at   DATETIME,
  updated_at   DATETIME,
  deleted_at   DATETIME,
  INDEX idx_slug      (slug),
  INDEX idx_status    (status),
  INDEX idx_featured  (featured),
  INDEX idx_published (published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Categories ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Tags ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tags (
  id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Post ↔ Category ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS post_categories (
  post_id     INT UNSIGNED NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (post_id, category_id),
  FOREIGN KEY (post_id)     REFERENCES posts(id)      ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Post ↔ Tag ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS post_tags (
  post_id INT UNSIGNED NOT NULL,
  tag_id  INT UNSIGNED NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id)  REFERENCES tags(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Contact messages ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  subject    VARCHAR(255) NOT NULL,
  message    TEXT         NOT NULL,
  ip_address VARCHAR(45),
  read_at    DATETIME,
  created_at DATETIME,
  updated_at DATETIME,
  INDEX idx_read_at (read_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
