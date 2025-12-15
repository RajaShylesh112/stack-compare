from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from pydantic import BaseModel
from middleware.internal_auth import verify_internal_key
from middleware.user_auth import verify_user_token
from lib.b2_client import get_b2_client
from utils.file_utils import sanitize_filename

router = APIRouter()


class UploadResponse(BaseModel):
    file_id: str
    file_name: str
    url: str


class PresignResponse(BaseModel):
    upload_url: str
    upload_id: str
    expires_in: int


class ReadResponse(BaseModel):
    signed_url: str
    expires_in: int


class ExistsResponse(BaseModel):
    exists: bool
    file_name: str


class ListResponse(BaseModel):
    files: list
    count: int


class DownloadResponse(BaseModel):
    file_name: str
    size: int
    content: str  # Base64 encoded


@router.post("/upload", response_model=UploadResponse, dependencies=[Depends(verify_internal_key)])
async def upload_file(file: UploadFile = File(...)):
    """Upload small files to Backblaze B2"""
    try:
        # Validate file size (max 100MB)
        content = await file.read()
        if len(content) > 100 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="File too large. Maximum size is 100MB")
        
        # Sanitize filename
        safe_filename = sanitize_filename(file.filename or 'unnamed')
        
        b2 = get_b2_client()
        result = await b2.upload_file(
            file_content=content,
            file_name=safe_filename,
            content_type=file.content_type or 'application/octet-stream'
        )
        
        return UploadResponse(**result)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to upload file")


@router.post("/presign", response_model=PresignResponse, dependencies=[Depends(verify_internal_key)])
async def generate_presigned_upload(file_name: str, expires_in: int = 3600):
    """Generate signed multipart upload URL"""
    try:
        # Sanitize and validate file_name
        safe_filename = sanitize_filename(file_name)
        
        # Validate expires_in (1 minute to 7 days)
        if not 60 <= expires_in <= 604800:
            raise HTTPException(status_code=400, detail="expires_in must be between 60 and 604800 seconds")
        
        b2 = get_b2_client()
        result = await b2.generate_presigned_upload_url(safe_filename, expires_in)
        return PresignResponse(**result)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to generate presigned URL")


@router.get("/read", response_model=ReadResponse, dependencies=[Depends(verify_user_token)])
async def get_signed_read_url(file_name: str, expires_in: int = 3600):
    """Return signed time-limited read URL"""
    try:
        # Sanitize and validate file_name
        safe_filename = sanitize_filename(file_name)
        
        # Validate expires_in
        if not 60 <= expires_in <= 604800:
            raise HTTPException(status_code=400, detail="expires_in must be between 60 and 604800 seconds")
        
        b2 = get_b2_client()
        result = await b2.generate_presigned_download_url(safe_filename, expires_in)
        return ReadResponse(**result)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to generate download URL")


@router.post("/exists", response_model=ExistsResponse, dependencies=[Depends(verify_internal_key)])
async def check_file_exists(file_name: str):
    """Check if object exists in B2"""
    try:
        b2 = get_b2_client()
        exists = await b2.file_exists(file_name)
        return ExistsResponse(exists=exists, file_name=file_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/delete", dependencies=[Depends(verify_internal_key)])
async def delete_file(file_name: str):
    """Delete a file from B2"""
    try:
        b2 = get_b2_client()
        success = await b2.delete_file(file_name)
        return {"success": success, "file_name": file_name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/list", response_model=ListResponse, dependencies=[Depends(verify_internal_key)])
async def list_files(prefix: str = "", max_keys: int = 100):
    """List files in B2 bucket"""
    try:
        # Validate max_keys to prevent abuse (1 to 1000)
        if not 1 <= max_keys <= 1000:
            raise HTTPException(status_code=400, detail="max_keys must be between 1 and 1000")
        
        b2 = get_b2_client()
        files = await b2.list_files(prefix, max_keys)
        return ListResponse(files=files, count=len(files))
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to list files")
