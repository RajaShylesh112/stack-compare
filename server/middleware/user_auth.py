from fastapi import Header, HTTPException, status
from settings import get_settings
from typing import Optional
import jwt


async def verify_user_token(authorization: Optional[str] = Header(None)):
    """Verify Neon Auth JWT token for frontend routes"""
    settings = get_settings()
    
    # Dev mode bypass (production check done at startup in main.py)
    if not authorization:
        if settings.enable_dev_mode:
            return {"user_id": "dev_user", "email": "dev@example.com"}
        raise HTTPException(status_code=401, detail="Authorization required")
    
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header"
        )
    
    token = authorization.replace("Bearer ", "")
    
    try:
        payload = jwt.decode(token, settings.neon_auth_secret.get_secret_value(), algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
