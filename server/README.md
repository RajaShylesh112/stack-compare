# Stack Compare Backend API

Production-grade FastAPI backend for Stack Compare platform.

## Architecture

- **Framework**: FastAPI + Uvicorn
- **Database**: Neon Postgres + pgvector
- **Auth**: Neon Auth (JWT) + Internal API Key
- **Storage**: Backblaze B2 (S3-compatible)
- **AI/ML**: OpenAI (embeddings + LLM)

## Setup

1. **Install dependencies**:
```bash
pip install -r requirements.txt
```

2. **Configure environment**:
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. **Run development server**:
```bash
uvicorn main:app --reload --port 8000
```

4. **Access API docs**:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Routes

### GitHub (`/api/github`)
- `POST /repo-stats` - Fetch repo statistics
- `POST /readme` - Fetch README content
- `POST /write` - Write files to repo
- `GET /read` - Read files (frontend-safe)

### npm (`/api/npm`)
- `POST /package` - Package metadata
- `POST /downloads` - Download statistics
- `POST /deps` - Dependency tree

### Libraries.io (`/api/libraries`)
- `POST /package` - Ecosystem metadata
- `POST /dependents` - Reverse dependencies
- `POST /platform` - Platform statistics

### StackOverflow (`/api/stackoverflow`)
- `POST /tags` - Tag counts
- `POST /activity` - Activity trends

### Backblaze B2 (`/api/b2`)
- `POST /upload` - Upload files
- `POST /presign` - Generate presigned URLs
- `GET /read` - Get signed read URL
- `POST /exists` - Check file existence

### AI/LLM (`/api/ai`)
- `POST /enrich-tech` - Technology enrichment
- `POST /enrich-stack` - Stack analysis
- `POST /rerank` - Rerank results

### Embeddings (`/api/embeddings`)
- `POST /tech` - Generate tech embedding
- `POST /project` - Generate project embedding

### Recommendations (`/api/recommend`)
- `POST /` - Get personalized recommendations

## Authentication

### n8n (Internal)
Add header: `x-internal-key: <INTERNAL_API_KEY>`

### Frontend (User)
Add header: `Authorization: Bearer <JWT_TOKEN>`

## Deployment

### DigitalOcean (Docker)
```bash
docker build -t stack-compare-backend .
docker run -p 8000:8000 --env-file .env stack-compare-backend
```

### Vercel (Serverless)
```bash
vercel --prod
```
