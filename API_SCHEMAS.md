# Stack Compare - API Schemas & Data Requirements

This document outlines all API endpoints, input schemas, and output JSON formats needed for the Stack Compare application.

---

## 📊 Available External APIs

1. **GitHub API** → Repository stats, stars, activity, issues, contributors
2. **npm API** → Package downloads (JavaScript/Node.js packages)
3. **StackOverflow API** → Tag popularity, question counts
4. **Libraries.io API** → Auto-discovery of repos, package metadata, dependencies

---

## 🎯 API Endpoints Required

### 1. Technology/Tool Comparison API

**Endpoint:** `GET /api/technologies/:techName`

**Purpose:** Get detailed information about a specific technology (React, Vue, Angular, etc.)

**Data Sources:**
- GitHub API (if open-source)
- npm API (if JS package)
- StackOverflow API (tag data)
- Libraries.io API (metadata)

**Input:**
```json
{
  "techName": "react",
  "includeStats": true,
  "includeFeatures": true,
  "includeTrends": true
}
```

**Output Schema:**
```json
{
  "technology": {
    "id": "react",
    "name": "React",
    "description": "A JavaScript library for building user interfaces",
    "category": "Frontend Framework",
    "version": "18.2.0",
    "license": "MIT",
    "firstRelease": "2013-05-29",
    "officialWebsite": "https://reactjs.org",
    "documentation": "https://reactjs.org/docs",
    
    "repository": {
      "platform": "github",
      "url": "https://github.com/facebook/react",
      "owner": "facebook",
      "stars": 213000,
      "forks": 44000,
      "watchers": 6800,
      "openIssues": 896,
      "closedIssues": 12345,
      "contributors": 1534,
      "lastCommit": "2024-12-01T10:30:00Z",
      "createdAt": "2013-05-24T16:15:54Z",
      "updatedAt": "2024-12-05T08:22:10Z"
    },
    
    "npmStats": {
      "packageName": "react",
      "weeklyDownloads": 18200000,
      "monthlyDownloads": 72800000,
      "downloads": [
        { "date": "2024-11-01", "downloads": 2450000 },
        { "date": "2024-11-08", "downloads": 2520000 },
        { "date": "2024-11-15", "downloads": 2680000 }
      ],
      "dependencies": 2,
      "dependents": 245000,
      "version": "18.2.0",
      "publishedAt": "2023-06-14T12:00:00Z"
    },
    
    "stackOverflow": {
      "tagName": "reactjs",
      "questionCount": 456789,
      "weeklyQuestions": 1250,
      "answeredPercentage": 87,
      "topQuestions": [
        {
          "title": "What is the difference between state and props?",
          "views": 1234567,
          "answers": 45,
          "votes": 2345
        }
      ]
    },
    
    "metrics": {
      "performance": 90,
      "learningCurve": 75,
      "communitySupport": 95,
      "ecosystem": 92,
      "maintenance": 88,
      "popularity": 95,
      "jobMarket": 88
    },
    
    "features": {
      "TypeScript Support": true,
      "Server-Side Rendering": true,
      "Mobile Development": true,
      "Testing Tools": true,
      "Developer Tools": true,
      "Hot Reloading": true,
      "Virtual DOM": true,
      "Component-Based": true
    },
    
    "alternatives": ["vue", "angular", "svelte", "solid"],
    "compatibleWith": ["next.js", "gatsby", "redux", "react-router"],
    
    "trends": {
      "github": [
        { "date": "2024-01", "stars": 210000 },
        { "date": "2024-06", "stars": 212000 },
        { "date": "2024-12", "tags": 213000 }
      ],
      "npm": [
        { "date": "2024-01", "downloads": 16500000 },
        { "date": "2024-06", "downloads": 17300000 },
        { "date": "2024-12", "downloads": 18200000 }
      ],
      "stackoverflow": [
        { "date": "2024-01", "questions": 450000 },
        { "date": "2024-06", "questions": 453000 },
        { "date": "2024-12", "questions": 456789 }
      ]
    },
    
    "jobMarket": {
      "openings": 23456,
      "averageSalary": {
        "min": 80000,
        "max": 150000,
        "currency": "USD"
      },
      "topCompanies": ["Facebook", "Netflix", "Airbnb", "Tesla"]
    }
  }
}
```

---

### 2. Technology Search/List API

**Endpoint:** `GET /api/technologies`

**Purpose:** List all available technologies with filtering

**Input Query Params:**
```
?category=frontend
&search=react
&sortBy=popularity
&limit=20
&page=1
```

**Output Schema:**
```json
{
  "technologies": [
    {
      "id": "react",
      "name": "React",
      "description": "A JavaScript library for building user interfaces",
      "category": "Frontend Framework",
      "logo": "https://cdn.example.com/logos/react.svg",
      "popularity": 95,
      "githubStars": "213k",
      "npmDownloads": "18.2M/week",
      "trending": true
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  },
  "categories": [
    "Frontend Framework",
    "Backend Framework",
    "Database",
    "Cloud & DevOps",
    "Mobile Development"
  ]
}
```

---

### 3. Technology Comparison API (Multi-Tech)

**Endpoint:** `POST /api/compare/technologies`

**Purpose:** Compare multiple technologies side-by-side

**Input:**
```json
{
  "technologies": ["react", "vue", "angular"],
  "compareMetrics": [
    "performance",
    "learning",
    "community",
    "ecosystem",
    "maintenance"
  ]
}
```

**Output Schema:**
```json
{
  "comparison": {
    "technologies": [
      {
        "id": "react",
        "name": "React",
        "metrics": {
          "performance": 90,
          "learning": 75,
          "community": 95,
          "ecosystem": 92,
          "maintenance": 88
        },
        "stats": {
          "githubStars": "213k",
          "npmDownloads": "18.2M/week",
          "contributors": "1,534",
          "openIssues": "896"
        }
      },
      {
        "id": "vue",
        "name": "Vue.js",
        "metrics": {
          "performance": 88,
          "learning": 85,
          "community": 90,
          "ecosystem": 88,
          "maintenance": 85
        },
        "stats": {
          "githubStars": "204k",
          "npmDownloads": "3.2M/week",
          "contributors": "412",
          "openIssues": "1,245"
        }
      }
    ],
    "winner": {
      "overall": "react",
      "byMetric": {
        "performance": "react",
        "learning": "vue",
        "community": "react",
        "ecosystem": "react",
        "maintenance": "react"
      }
    },
    "radarChartData": [
      { "metric": "Performance", "React": 90, "Vue": 88, "Angular": 85 },
      { "metric": "Learning", "React": 75, "Vue": 85, "Angular": 65 },
      { "metric": "Community", "React": 95, "Vue": 90, "Angular": 88 }
    ]
  }
}
```

---

### 4. Tech Stack Comparison API

**Endpoint:** `POST /api/compare/stacks`

**Purpose:** Compare complete technology stacks (MERN, LAMP, JAMstack, etc.)

**Input:**
```json
{
  "stacks": ["mern", "lamp", "jamstack"],
  "compareMetrics": [
    "performance",
    "scalability",
    "learning",
    "community",
    "jobMarket",
    "maintenance"
  ]
}
```

**Output Schema:**
```json
{
  "comparison": {
    "stacks": [
      {
        "id": "mern",
        "name": "MERN Stack",
        "description": "MongoDB, Express.js, React, Node.js",
        "technologies": [
          {
            "layer": "database",
            "technology": "MongoDB",
            "githubStars": "24.5k",
            "npmDownloads": "950k/week"
          },
          {
            "layer": "backend",
            "technology": "Express.js",
            "githubStars": "61.5k",
            "npmDownloads": "26.8M/week"
          },
          {
            "layer": "frontend",
            "technology": "React",
            "githubStars": "213k",
            "npmDownloads": "18.2M/week"
          },
          {
            "layer": "runtime",
            "technology": "Node.js",
            "githubStars": "98.2k",
            "downloads": "45M/month"
          }
        ],
        "metrics": {
          "performance": 85,
          "scalability": 90,
          "learning": 75,
          "community": 95,
          "jobMarket": 88,
          "maintenance": 80
        },
        "aggregateStats": {
          "totalGithubStars": "847k",
          "weeklyNpmDownloads": "15.2M",
          "jobOpenings": 23456,
          "topCompanies": ["Netflix", "Facebook", "WhatsApp", "Uber"]
        },
        "pros": [
          "Full JavaScript stack",
          "Large community",
          "Abundant learning resources",
          "Fast development"
        ],
        "cons": [
          "Callback complexity",
          "Not ideal for CPU-intensive tasks",
          "MongoDB may not suit all use cases"
        ]
      }
    ],
    "radarChartData": [
      { "metric": "Performance", "MERN": 85, "LAMP": 80, "JAMstack": 95 },
      { "metric": "Scalability", "MERN": 90, "LAMP": 70, "JAMstack": 90 }
    ]
  }
}
```

---

### 5. Stack Builder Compatibility API

**Endpoint:** `POST /api/stack-builder/check-compatibility`

**Purpose:** Check compatibility between selected technologies

**Input:**
```json
{
  "selectedTechnologies": {
    "frontend": "react",
    "backend": "express",
    "database": "mongodb",
    "auth": "firebase-auth",
    "hosting": "vercel",
    "storage": "aws-s3"
  }
}
```

**Output Schema:**
```json
{
  "compatibility": {
    "score": 85,
    "status": "excellent",
    "issues": [],
    "warnings": [
      {
        "severity": "low",
        "message": "Firebase Auth and AWS S3 require separate authentication flows",
        "recommendation": "Consider using AWS Cognito for unified auth"
      }
    ],
    "suggestions": [
      {
        "category": "database",
        "current": "mongodb",
        "alternatives": ["supabase", "dynamodb"],
        "reason": "Better integration with your hosting choice (Vercel)"
      }
    ],
    "estimatedCost": {
      "monthly": {
        "min": 50,
        "max": 500,
        "currency": "USD"
      },
      "breakdown": {
        "hosting": "0-20",
        "database": "0-100",
        "auth": "0-50",
        "storage": "10-200",
        "other": "40-130"
      }
    },
    "performance": {
      "score": 90,
      "notes": "Excellent performance expected with this stack"
    },
    "complexity": {
      "score": 65,
      "level": "medium",
      "notes": "Moderate learning curve for team members"
    }
  }
}
```

---

### 6. AI Recommendations API

**Endpoint:** `POST /api/recommendations`

**Purpose:** Get AI-powered technology stack recommendations

**Input:**
```json
{
  "projectType": "web",
  "description": "E-commerce platform with real-time inventory",
  "teamSize": "small",
  "budgetLevel": "medium",
  "requirements": {
    "needsRealtime": true,
    "expectedUsers": "10000-50000",
    "dataComplexity": "medium",
    "securityLevel": "high",
    "scalability": "high"
  },
  "preferences": {
    "preferredLanguages": ["javascript", "typescript"],
    "existingExpertise": ["react", "node.js"],
    "deploymentPreference": "cloud"
  }
}
```

**Output Schema:**
```json
{
  "recommendations": {
    "primary": {
      "stackName": "Modern E-commerce Stack",
      "confidence": 92,
      "technologies": {
        "frontend": {
          "name": "Next.js",
          "version": "14.x",
          "reason": "SEO benefits, server-side rendering for product pages, excellent performance",
          "alternatives": ["Remix", "Gatsby"]
        },
        "backend": {
          "name": "Node.js with Express",
          "version": "20.x LTS",
          "reason": "Team expertise, great for real-time features, large ecosystem",
          "alternatives": ["NestJS", "Fastify"]
        },
        "database": {
          "name": "PostgreSQL",
          "version": "15.x",
          "reason": "ACID compliance for transactions, excellent for e-commerce",
          "alternatives": ["MongoDB", "Supabase"]
        },
        "realtime": {
          "name": "Socket.io",
          "reason": "Real-time inventory updates, order notifications",
          "alternatives": ["Pusher", "Ably"]
        },
        "auth": {
          "name": "Auth0",
          "reason": "Enterprise-grade security, easy integration, supports social logins",
          "alternatives": ["Clerk", "Supabase Auth"]
        },
        "payment": {
          "name": "Stripe",
          "reason": "Industry standard, comprehensive API, excellent documentation",
          "alternatives": ["PayPal", "Square"]
        },
        "hosting": {
          "name": "Vercel",
          "reason": "Optimized for Next.js, easy deployment, edge functions",
          "alternatives": ["AWS", "Railway"]
        },
        "storage": {
          "name": "AWS S3",
          "reason": "Scalable, cost-effective for product images",
          "alternatives": ["Cloudinary", "Vercel Blob"]
        }
      },
      "estimatedCost": {
        "startup": {
          "monthly": 150,
          "annual": 1500
        },
        "growth": {
          "monthly": 500,
          "annual": 5000
        },
        "scale": {
          "monthly": 2000,
          "annual": 20000
        }
      },
      "developmentTime": {
        "mvp": "6-8 weeks",
        "production": "12-16 weeks"
      },
      "teamRequirements": {
        "frontend": 2,
        "backend": 2,
        "devops": 1,
        "skills": ["React", "Node.js", "PostgreSQL", "AWS"]
      },
      "pros": [
        "Leverages existing team expertise",
        "Scalable architecture",
        "Strong real-time capabilities",
        "Excellent developer experience",
        "Large community support"
      ],
      "cons": [
        "Initial AWS setup complexity",
        "Auth0 costs scale with users",
        "Requires good PostgreSQL knowledge"
      ],
      "risks": [
        {
          "risk": "Real-time scaling",
          "severity": "medium",
          "mitigation": "Use Redis for Socket.io adapter, implement connection pooling"
        }
      ]
    },
    "alternatives": [
      {
        "stackName": "Serverless E-commerce",
        "confidence": 78,
        "keyDifferences": ["Uses Supabase instead of PostgreSQL", "Vercel Functions instead of Express"],
        "reason": "Lower operational overhead, automatic scaling"
      }
    ],
    "learningResources": [
      {
        "technology": "Next.js",
        "resources": [
          {
            "title": "Next.js Official Tutorial",
            "url": "https://nextjs.org/learn",
            "type": "documentation"
          },
          {
            "title": "Next.js E-commerce Course",
            "url": "https://example.com/course",
            "type": "course",
            "duration": "8 hours"
          }
        ]
      }
    ]
  }
}
```

---

### 7. Trending Technologies API

**Endpoint:** `GET /api/trends`

**Purpose:** Get trending technologies and their growth metrics

**Input Query Params:**
```
?category=all
&period=6months
&limit=10
```

**Output Schema:**
```json
{
  "trends": {
    "period": "6months",
    "technologies": [
      {
        "id": "bun",
        "name": "Bun",
        "category": "JavaScript Runtime",
        "trendScore": 95,
        "growthRate": 450,
        "currentStats": {
          "githubStars": 45000,
          "weeklyDownloads": 850000,
          "stackoverflowQuestions": 2345
        },
        "historicalData": [
          { "date": "2024-06", "stars": 25000, "downloads": 300000 },
          { "date": "2024-12", "stars": 45000, "downloads": 850000 }
        ],
        "reason": "Significantly faster than Node.js, built-in bundler and test runner",
        "momentum": "rising_star"
      }
    ],
    "categories": {
      "frontend": [
        { "name": "Solid.js", "trendScore": 88 },
        { "name": "Qwik", "trendScore": 82 }
      ],
      "backend": [
        { "name": "Bun", "trendScore": 95 },
        { "name": "Hono", "trendScore": 85 }
      ]
    }
  }
}
```

---

### 8. Technology Statistics API

**Endpoint:** `GET /api/technologies/:techName/stats`

**Purpose:** Get detailed statistics for analytics dashboard

**Output Schema:**
```json
{
  "technology": "react",
  "stats": {
    "github": {
      "stars": 213000,
      "forks": 44000,
      "contributors": 1534,
      "commits": 15234,
      "releases": 184,
      "pullRequests": {
        "open": 234,
        "closed": 8765,
        "merged": 7892
      },
      "issues": {
        "open": 896,
        "closed": 12345
      },
      "activity": {
        "lastCommit": "2024-12-05T08:00:00Z",
        "commitsLastMonth": 234,
        "contributorsLastMonth": 45
      }
    },
    "npm": {
      "downloads": {
        "daily": 2600000,
        "weekly": 18200000,
        "monthly": 72800000,
        "yearly": 873600000
      },
      "dependents": 245000,
      "dependencies": 2,
      "versions": 156,
      "unpacked": "2.5 MB"
    },
    "stackoverflow": {
      "totalQuestions": 456789,
      "questionsThisWeek": 1250,
      "answered": 397567,
      "answerRate": 87,
      "avgViewsPerQuestion": 2345,
      "topTags": ["reactjs", "react-hooks", "react-router", "redux"]
    },
    "jobMarket": {
      "openings": 23456,
      "growthRate": 12,
      "topLocations": [
        { "city": "San Francisco", "count": 3456 },
        { "city": "New York", "count": 2890 }
      ],
      "salaryRange": {
        "junior": { "min": 60000, "max": 90000 },
        "mid": { "min": 90000, "max": 130000 },
        "senior": { "min": 130000, "max": 200000 }
      }
    }
  }
}
```

---

### 9. Search/Autocomplete API

**Endpoint:** `GET /api/search`

**Purpose:** Search across technologies, stacks, and tools

**Input Query Params:**
```
?q=react
&type=technology
&limit=10
```

**Output Schema:**
```json
{
  "results": [
    {
      "id": "react",
      "name": "React",
      "type": "technology",
      "category": "Frontend Framework",
      "description": "A JavaScript library for building user interfaces",
      "logo": "https://cdn.example.com/logos/react.svg",
      "popularity": 95
    },
    {
      "id": "react-native",
      "name": "React Native",
      "type": "technology",
      "category": "Mobile Framework",
      "description": "Build mobile apps with React",
      "logo": "https://cdn.example.com/logos/react-native.svg",
      "popularity": 88
    }
  ],
  "suggestions": ["react native", "react router", "react query"],
  "totalResults": 42
}
```

---

### 10. Category/Technology Metadata API

**Endpoint:** `GET /api/categories`

**Purpose:** Get all categories with their technologies

**Output Schema:**
```json
{
  "categories": [
    {
      "id": "frontend",
      "name": "Frontend Frameworks",
      "description": "Client-side frameworks and libraries",
      "icon": "code",
      "count": 45,
      "popular": ["react", "vue", "angular", "svelte"],
      "trending": ["solid", "qwik", "astro"]
    },
    {
      "id": "backend",
      "name": "Backend Frameworks",
      "description": "Server-side frameworks",
      "icon": "server",
      "count": 38,
      "popular": ["express", "nestjs", "django", "fastapi"],
      "trending": ["hono", "elysia", "h3"]
    }
  ]
}
```

---

## 🔄 Data Mapping Strategy

### From GitHub API:
```javascript
// Map GitHub repository data to our format
{
  stars: repo.stargazers_count,
  forks: repo.forks_count,
  watchers: repo.watchers_count,
  openIssues: repo.open_issues_count,
  contributors: contributors_url response,
  lastCommit: commits[0].commit.author.date,
  createdAt: repo.created_at,
  updatedAt: repo.updated_at,
  license: repo.license.spdx_id,
  description: repo.description
}
```

### From npm API:
```javascript
// Map npm package data
{
  weeklyDownloads: downloads.downloads,
  packageName: package.name,
  version: package['dist-tags'].latest,
  dependencies: Object.keys(package.dependencies || {}).length,
  dependents: dependents.length,
  publishedAt: time.modified
}
```

### From StackOverflow API:
```javascript
// Map StackOverflow tag data
{
  tagName: tag.name,
  questionCount: tag.count,
  answeredPercentage: (tag.count - tag.unanswered_questions) / tag.count * 100
}
```

### From Libraries.io API:
```javascript
// Use as fallback for discovering package names and repos
{
  repository: platform.repository_url,
  packageManager: platform.platform,
  homepage: project.homepage
}
```

---

## 📝 Notes for Backend Implementation

1. **Caching Strategy**: Cache GitHub/npm/SO data for 6-24 hours to avoid rate limits
2. **Rate Limiting**: Implement rate limiting on your API endpoints
3. **Error Handling**: Return proper HTTP status codes with error messages
4. **Pagination**: All list endpoints should support pagination
5. **Filtering**: Support multiple filter parameters
6. **Data Freshness**: Add `lastUpdated` timestamp to all responses
7. **Webhooks**: Consider GitHub webhooks for real-time repo updates

---

## 🎨 UI Component Data Binding

### Compare Tech Page (`/compare/tech`)
- Needs: **Technology Comparison API** (#3)
- Binds to: `radarChartData`, `features`, `stats`, `metrics`

### Compare Stack Page (`/compare/stack`)
- Needs: **Tech Stack Comparison API** (#4)
- Binds to: `stacks[].metrics`, `radarChartData`, `aggregateStats`

### Recommendations Page (`/recommendations`)
- Needs: **AI Recommendations API** (#6)
- Binds to: `recommendations.primary.technologies`, `estimatedCost`, `pros/cons`

### Stack Builder Page (`/stack-builder`)
- Needs: **Stack Builder Compatibility API** (#5)
- Binds to: `compatibility.score`, `warnings`, `suggestions`, `estimatedCost`

### Technology Showcase (Homepage)
- Needs: **Technology Search/List API** (#2)
- Binds to: `technologies[]`, grouped by `category`

### Analytics Dashboard (`/analytics`)
- Needs: **Technology Statistics API** (#8)
- Binds to: `stats.github`, `stats.npm`, `stats.stackoverflow`

---

## ✅ Implementation Priority

1. **Technology Search/List API** (#2) - Core functionality
2. **Technology Detail API** (#1) - Individual tech pages
3. **Technology Comparison API** (#3) - Compare page
4. **Tech Stack Comparison API** (#4) - Stack compare page
5. **AI Recommendations API** (#6) - Recommendations feature
6. **Stack Builder Compatibility API** (#5) - Stack builder
7. **Trending Technologies API** (#7) - Homepage trends
8. **Search/Autocomplete API** (#9) - Search functionality
9. **Technology Statistics API** (#8) - Analytics
10. **Category Metadata API** (#10) - Navigation

---

**Total APIs to Implement:** 10 endpoints
**External APIs to Integrate:** 4 (GitHub, npm, StackOverflow, Libraries.io)
