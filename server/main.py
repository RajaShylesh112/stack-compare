from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
import logging

from api import github, npm, libraries, stackoverflow, b2, ai, embeddings, recommend
from settings import get_settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load settings at startup
settings = get_settings()

# Validate production environment at startup
import os
IS_PRODUCTION = os.getenv("VERCEL_ENV") == "production" or os.getenv("ENV") == "production"

if IS_PRODUCTION and settings.enable_dev_mode:
    # Log warning instead of crashing - allow deployment to proceed
    logger.warning(
        "WARNING: Dev mode is enabled in production environment. "
        "This should be disabled by setting ENABLE_DEV_MODE=false in Vercel environment variables. "
        "Authentication bypass is active!"
    )

app = FastAPI(
    title="Stack Compare Backend API",
    description="Production-grade backend for Stack Compare - handles GitHub, npm, Libraries.io, StackOverflow, Backblaze B2, and AI/ML operations",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    debug=settings.debug
)

# CORS middleware with validation and edge case handling
if not settings.allowed_origins or not settings.allowed_origins.strip():
    logger.warning("ALLOWED_ORIGINS not set, using default localhost origins")
    settings.allowed_origins = "http://localhost:3000,http://localhost:3001"

allowed_origins = [
    origin.strip() 
    for origin in settings.allowed_origins.split(",") 
    if origin.strip()  # Filter out empty strings from trailing commas
]

if not allowed_origins:
    logger.warning("No valid origins found, using wildcard (dev only)")
    allowed_origins = ["*"]

# Handle wildcard origins - CORS spec violation with credentials
has_wildcard = "*" in allowed_origins
allow_credentials = True

if has_wildcard:
    logger.warning("CORS wildcard (*) detected. Disabling credentials per CORS spec.")
    allow_credentials = False  # CORS spec: wildcard incompatible with credentials
    if IS_PRODUCTION:
        logger.error(
            "ERROR: Wildcard origins detected in production. "
            "Set specific origins in ALLOWED_ORIGINS for security."
        )

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    logger.info(f"{request.method} {request.url.path} - {response.status_code} - {duration:.3f}s")
    return response


# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "stack-compare-backend"}


# Include routers
app.include_router(github.router, prefix="/api/github", tags=["GitHub"])
app.include_router(npm.router, prefix="/api/npm", tags=["npm"])
app.include_router(libraries.router, prefix="/api/libraries", tags=["Libraries.io"])
app.include_router(stackoverflow.router, prefix="/api/stackoverflow", tags=["StackOverflow"])
app.include_router(b2.router, prefix="/api/b2", tags=["Backblaze B2"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI/LLM"])
app.include_router(embeddings.router, prefix="/api/embeddings", tags=["Embeddings"])
app.include_router(recommend.router, prefix="/api/recommend", tags=["Recommendations"])


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc) if app.debug else "An error occurred"}
    )
