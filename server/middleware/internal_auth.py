from fastapi import Header, HTTPException, status
from settings import get_settings
from typing import Optional
import secrets


async def verify_internal_key(x_internal_key: Optional[str] = Header(None)):
    """Verify internal API key for n8n routes"""
    settings = get_settings()
    
    # Dev mode bypass (production check done at startup in main.py)
    if not x_internal_key:
        if settings.enable_dev_mode:
            return {"client": "dev_mode"}
        raise HTTPException(status_code=401, detail="Internal API key required")
    
    # Ensure internal API key is configured
    if not settings.internal_api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal API key not configured"
        )
    
    # Use constant-time comparison to prevent timing attacks
    expected_key = settings.internal_api_key.get_secret_value()
    if not secrets.compare_digest(x_internal_key, expected_key):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid internal API key"
        )