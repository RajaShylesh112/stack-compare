"""
Utility functions for file operations
"""
import re
from fastapi import HTTPException


def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename to prevent path traversal and ensure safe characters
    
    Args:
        filename: Original filename
        
    Returns:
        Sanitized filename
        
    Raises:
        HTTPException: If filename is invalid or unsafe
    """
    if not filename:
        raise HTTPException(status_code=400, detail="Filename cannot be empty")
    
    # Strip whitespace
    filename = filename.strip()
    
    # Check length
    if len(filename) > 255:
        raise HTTPException(status_code=400, detail="Filename too long (max 255 characters)")
    
    # Reject path traversal attempts
    if '..' in filename:
        raise HTTPException(status_code=400, detail="Path traversal not allowed")
    
    # Strip leading/trailing slashes first for normalization
    temp_filename = filename.strip('/')
    
    # Check if original had leading slash (absolute path) after stripping whitespace
    if filename.startswith('/') or filename.startswith('\\'):
        # Only reject if it's truly absolute (not just trailing slash)
        if temp_filename and filename[0] in ['/', '\\']:
            raise HTTPException(status_code=400, detail="Absolute paths not allowed")
    
    # Check for Windows drive letters
    if len(filename) >= 2 and filename[1] == ':':
        raise HTTPException(status_code=400, detail="Drive letters not allowed")
    
    # Sanitize to allowed characters (alphanumeric, dash, underscore, dot, forward slash for folders)
    # Allow forward slash for folder structure but not backslash
    safe_filename = re.sub(r'[^a-zA-Z0-9._/-]', '_', filename)
    
    # Prevent multiple consecutive slashes
    safe_filename = re.sub(r'/+', '/', safe_filename)
    
    # Remove leading/trailing slashes
    safe_filename = safe_filename.strip('/')
    
    # Check if result is empty or only invalid characters
    if not safe_filename or safe_filename.replace('_', '').strip() == '':
        raise HTTPException(status_code=400, detail="Filename contains only invalid characters")
    
    return safe_filename
