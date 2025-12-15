from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
import logging
import os

from api import github, npm, libraries, stackoverflow, b2, ai, embeddings, recommend
from settings import get_settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load settings at startup
settings = get_settings()

# Validate production environment at startup
IS_PRODUCTION = os.getenv("VERCEL_ENV") == "production" or os.getenv("ENV") == "production"

if IS_PRODUCTION and settings.enable_dev_mode:
    logger.warning(
        "WARNING: Dev mode is enabled in production. "
        "Set ENABLE_DEV_MODE=false in Vercel environment variables."
    )

# Create FastAPI app
app = FastAPI(
    title="Stack Compare Backend API",
    description="Production-grade backend for Stack Compare",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    debug=settings.debug
)

# CORS middleware
allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001")
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",") if origin.strip()]

if not allowed_origins:
    allowed_origins = ["*"]

has_wildcard = "*" in allowed_origins
allow_credentials = not has_wildcard

if has_wildcard and IS_PRODUCTION:
    logger.warning("Wildcard CORS in production - set specific origins")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    logger.info(f"{request.method} {request.url.path} - {response.status_code} - {duration:.3f}s")
    return response

# Health check
@app.get("/")
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "stack-compare-backend",
        "version": "1.0.0"
    }

# Include routers
app.include_router(github.router, prefix="/github", tags=["GitHub"])
app.include_router(npm.router, prefix="/npm", tags=["npm"])
app.include_router(libraries.router, prefix="/libraries", tags=["Libraries.io"])
app.include_router(stackoverflow.router, prefix="/stackoverflow", tags=["StackOverflow"])
app.include_router(b2.router, prefix="/b2", tags=["Backblaze B2"])
app.include_router(ai.router, prefix="/ai", tags=["AI"])
app.include_router(embeddings.router, prefix="/embeddings", tags=["Embeddings"])
app.include_router(recommend.router, prefix="/recommend", tags=["Recommendations"])

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

# Vercel serverless handler
handler = app
