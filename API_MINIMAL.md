# Minimal API Schemas - Stack Compare

**Goal:** Essential, compact JSON schemas optimized for SQL storage and clean UI display.

---

## 🗄️ Database Schema Overview

### Core Tables Required:
1. **technologies** - Individual tech (React, Vue, etc.)
2. **stacks** - Predefined stacks (MERN, LAMP, etc.)
3. **categories** - Frontend, Backend, Database, etc.
4. **technology_stats** - GitHub/npm/SO metrics
5. **comparisons** - Saved user comparisons

---

## 📡 Minimal API Endpoints (4 Core APIs)

### 1. GET /api/technologies

**Purpose:** List all technologies or get single tech details

**Query Params:**
```
?id=react           // Get single tech
?category=frontend  // Filter by category
?limit=20
```

**Output:**
```json
{
  "data": [
    {
      "id": "react",
      "name": "React",
      "tagline": "A JavaScript library for building user interfaces",
      "category": "frontend",
      "logo": "https://cdn.../react.svg",
      "stats": {
        "stars": 213000,
        "downloads": 18200000,
        "score": 95
      }
    }
  ],
  "total": 150
}
```

**Single Tech Detail:**
```json
{
  "id": "react",
  "name": "React",
  "tagline": "A JavaScript library for building user interfaces",
  "category": "frontend",
  "version": "18.2.0",
  "license": "MIT",
  "website": "https://reactjs.org",
  "repo": "https://github.com/facebook/react",
  "stats": {
    "stars": 213000,
    "downloads": 18200000,
    "questions": 456789,
    "score": 95
  },
  "metrics": {
    "performance": 90,
    "learning": 75,
    "community": 95
  },
  "features": ["TypeScript", "SSR", "Mobile", "Testing"],
  "alternatives": ["vue", "angular", "svelte"]
}
```

**SQL Tables:**
```sql
-- technologies
id, name, tagline, category, version, license, website, repo_url

-- technology_stats (daily updates)
tech_id, date, stars, downloads, questions, score

-- technology_features (many-to-many)
tech_id, feature_name
```

---

### 2. POST /api/compare

**Purpose:** Compare technologies or stacks

**Input:**
```json
{
  "type": "tech",
  "items": ["react", "vue", "angular"]
}
```

**Output:**
```json
{
  "items": [
    {
      "id": "react",
      "name": "React",
      "stats": {
        "stars": 213000,
        "downloads": 18200000,
        "score": 95
      },
      "metrics": {
        "performance": 90,
        "learning": 75,
        "community": 95
      }
    },
    {
      "id": "vue",
      "name": "Vue.js",
      "stats": {
        "stars": 204000,
        "downloads": 3200000,
        "score": 90
      },
      "metrics": {
        "performance": 88,
        "learning": 85,
        "community": 90
      }
    }
  ],
  "chart": [
    { "metric": "Performance", "React": 90, "Vue": 88, "Angular": 85 },
    { "metric": "Learning", "React": 75, "Vue": 85, "Angular": 65 },
    { "metric": "Community", "React": 95, "Vue": 90, "Angular": 88 }
  ]
}
```

**SQL Tables:**
```sql
-- comparisons (user saves)
id, user_id, type, items_json, created_at

-- No need for complex joins, use JSON column for flexibility
```

---

### 3. GET /api/stacks

**Purpose:** Get predefined stacks or check custom stack compatibility

**Query Params:**
```
?id=mern           // Get single stack
?category=web      // Filter stacks
```

**Output (List):**
```json
{
  "data": [
    {
      "id": "mern",
      "name": "MERN Stack",
      "description": "MongoDB, Express.js, React, Node.js",
      "category": "web",
      "popularity": 95,
      "jobOpenings": 23456
    }
  ]
}
```

**Output (Single Stack):**
```json
{
  "id": "mern",
  "name": "MERN Stack",
  "description": "MongoDB, Express.js, React, Node.js",
  "category": "web",
  "technologies": [
    { "layer": "database", "tech": "mongodb" },
    { "layer": "backend", "tech": "express" },
    { "layer": "frontend", "tech": "react" },
    { "layer": "runtime", "tech": "nodejs" }
  ],
  "metrics": {
    "performance": 85,
    "scalability": 90,
    "learning": 75
  },
  "stats": {
    "totalStars": 847000,
    "jobOpenings": 23456
  },
  "pros": ["Full JavaScript", "Large community", "Fast development"],
  "cons": ["Not ideal for CPU-intensive tasks"]
}
```

**POST /api/stacks/check** (Custom Stack Validation):

**Input:**
```json
{
  "technologies": {
    "frontend": "react",
    "backend": "express",
    "database": "mongodb"
  }
}
```

**Output:**
```json
{
  "score": 92,
  "status": "excellent",
  "warnings": [],
  "cost": {
    "min": 50,
    "max": 500
  }
}
```

**SQL Tables:**
```sql
-- stacks
id, name, description, category, popularity

-- stack_technologies (many-to-many)
stack_id, tech_id, layer

-- stack_metrics
stack_id, performance, scalability, learning
```

---

### 4. POST /api/recommend

**Purpose:** Get AI stack recommendations

**Input:**
```json
{
  "projectType": "web",
  "teamSize": "small",
  "budget": "medium",
  "realtime": true
}
```

**Output:**
```json
{
  "stack": {
    "name": "Modern Web Stack",
    "confidence": 92,
    "technologies": {
      "frontend": { "name": "Next.js", "reason": "SEO + SSR" },
      "backend": { "name": "Node.js", "reason": "Team expertise" },
      "database": { "name": "PostgreSQL", "reason": "ACID compliance" },
      "auth": { "name": "Auth0", "reason": "Enterprise security" }
    },
    "cost": {
      "monthly": 150,
      "annual": 1500
    },
    "timeline": "6-8 weeks",
    "pros": ["Fast development", "Scalable"],
    "cons": ["Initial setup complexity"]
  },
  "alternatives": [
    {
      "name": "Serverless Stack",
      "confidence": 78,
      "reason": "Lower operational overhead"
    }
  ]
}
```

**SQL Tables:**
```sql
-- recommendations (cache results)
id, input_hash, result_json, created_at

-- Use JSON column to store flexible recommendation data
```

---

## 📊 External API Integration Summary

### GitHub API → Store Daily:
```json
{
  "stars": 213000,
  "forks": 44000,
  "issues": 896,
  "lastUpdate": "2024-12-05"
}
```

### npm API → Store Weekly:
```json
{
  "downloads": 18200000,
  "version": "18.2.0"
}
```

### StackOverflow API → Store Weekly:
```json
{
  "questions": 456789,
  "answered": 87
}
```

### Data Update Strategy:
- **GitHub stats**: Update daily via cron job
- **npm downloads**: Update weekly
- **StackOverflow**: Update weekly
- **Computed scores**: Recalculate when stats update

---

## 🎯 Simplified SQL Schema

```sql
-- Core table: technologies
CREATE TABLE technologies (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  tagline TEXT,
  category VARCHAR(50),
  version VARCHAR(20),
  license VARCHAR(20),
  website VARCHAR(255),
  repo_url VARCHAR(255),
  logo_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stats table: updated by cron jobs
CREATE TABLE technology_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tech_id VARCHAR(50),
  date DATE,
  stars INT,
  forks INT,
  issues INT,
  downloads BIGINT,
  questions INT,
  score INT, -- computed 0-100
  FOREIGN KEY (tech_id) REFERENCES technologies(id),
  UNIQUE KEY (tech_id, date)
);

-- Metrics table: manually curated or AI-generated
CREATE TABLE technology_metrics (
  tech_id VARCHAR(50) PRIMARY KEY,
  performance INT, -- 0-100
  learning INT,    -- 0-100
  community INT,   -- 0-100
  ecosystem INT,   -- 0-100
  maintenance INT, -- 0-100
  FOREIGN KEY (tech_id) REFERENCES technologies(id)
);

-- Features: many-to-many
CREATE TABLE features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE
);

CREATE TABLE technology_features (
  tech_id VARCHAR(50),
  feature_id INT,
  PRIMARY KEY (tech_id, feature_id),
  FOREIGN KEY (tech_id) REFERENCES technologies(id),
  FOREIGN KEY (feature_id) REFERENCES features(id)
);

-- Stacks
CREATE TABLE stacks (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  popularity INT,
  job_openings INT,
  pros JSON,
  cons JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stack_technologies (
  stack_id VARCHAR(50),
  tech_id VARCHAR(50),
  layer VARCHAR(50), -- frontend, backend, database, etc.
  PRIMARY KEY (stack_id, tech_id),
  FOREIGN KEY (stack_id) REFERENCES stacks(id),
  FOREIGN KEY (tech_id) REFERENCES technologies(id)
);

CREATE TABLE stack_metrics (
  stack_id VARCHAR(50) PRIMARY KEY,
  performance INT,
  scalability INT,
  learning INT,
  community INT,
  FOREIGN KEY (stack_id) REFERENCES stacks(id)
);

-- User comparisons (optional)
CREATE TABLE user_comparisons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(50),
  type VARCHAR(20), -- 'tech' or 'stack'
  items JSON, -- ["react", "vue", "angular"]
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recommendation cache
CREATE TABLE recommendations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  input_hash VARCHAR(64) UNIQUE,
  project_type VARCHAR(50),
  team_size VARCHAR(20),
  budget VARCHAR(20),
  result JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);

-- Categories
CREATE TABLE categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  icon VARCHAR(50)
);
```

---

## 🔄 Data Flow

### 1. Initial Setup (One-time):
```
Libraries.io API → Discover tech names/repos → Insert into `technologies` table
Manual curation → Add `technology_metrics` and `features`
```

### 2. Daily Updates (Cron):
```
GitHub API → Fetch stars/forks/issues → Insert into `technology_stats`
Calculate score (weighted avg) → Update `technology_stats.score`
```

### 3. Weekly Updates (Cron):
```
npm API → Fetch downloads → Update `technology_stats.downloads`
StackOverflow API → Fetch questions → Update `technology_stats.questions`
```

### 4. On API Request:
```
GET /api/technologies?id=react
→ Join `technologies` + latest `technology_stats` + `technology_metrics`
→ Return formatted JSON
```

---

## ✅ Implementation Checklist

### Phase 1: Core Data (Week 1)
- [ ] Set up PostgreSQL/MySQL database
- [ ] Create all tables
- [ ] Seed initial technologies (top 50)
- [ ] Add categories and features
- [ ] Manual metrics input

### Phase 2: External APIs (Week 2)
- [ ] GitHub API integration
- [ ] npm API integration
- [ ] StackOverflow API integration
- [ ] Cron jobs for daily/weekly updates

### Phase 3: Core APIs (Week 2-3)
- [ ] GET /api/technologies (list + detail)
- [ ] POST /api/compare
- [ ] GET /api/stacks
- [ ] POST /api/stacks/check

### Phase 4: Advanced Features (Week 3-4)
- [ ] POST /api/recommend (AI logic)
- [ ] User authentication (Appwrite)
- [ ] Save comparisons
- [ ] Search/autocomplete

---

## 💡 Key Simplifications Made

1. **Removed redundant nested objects** - Flattened structure
2. **Single stats object** - Combined GitHub + npm + SO into one
3. **JSON columns for flexibility** - Pros/cons, recommendations
4. **Computed scores** - Single 0-100 score vs multiple metrics
5. **Minimal endpoints** - 4 core APIs instead of 10
6. **Caching strategy** - Update stats periodically, not real-time
7. **Predefined stacks** - Store common stacks in DB vs compute on-the-fly

---

**Total APIs:** 4 core endpoints
**Total Tables:** 10 (highly normalized)
**Data Sources:** 3 external APIs (GitHub, npm, StackOverflow)
**Update Frequency:** Daily for GitHub, Weekly for npm/SO
