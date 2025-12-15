"""
Backblaze B2 S3-compatible client using boto3
Handles file upload, download, presigned URLs, and object existence checks
"""
import boto3
from botocore.client import Config
from botocore.exceptions import ClientError
from settings import get_settings
from typing import Optional
import logging
import asyncio
from functools import partial

logger = logging.getLogger(__name__)


class B2Client:
    """Backblaze B2 S3-compatible storage client"""
    
    def __init__(self):
        settings = get_settings()
        
        # Configure S3 client for Backblaze B2
        self.s3_client = boto3.client(
            's3',
            endpoint_url=f'https://{settings.b2_endpoint}',
            aws_access_key_id=settings.b2_key_id.get_secret_value(),
            aws_secret_access_key=settings.b2_app_key.get_secret_value(),
            region_name='us-east-005',  # Backblaze B2 region
            config=Config(
                signature_version='s3v4',
                s3={'addressing_style': 'path'}  # Required for Backblaze B2
            )
        )
        self.bucket_name = settings.b2_bucket
    
    async def upload_file(self, file_content: bytes, file_name: str, content_type: str = 'application/octet-stream') -> dict:
        """
        Upload file to Backblaze B2
        
        Args:
            file_content: File bytes
            file_name: Name/path for the file in B2
            content_type: MIME type of the file
            
        Returns:
            dict with file_id, file_name, and url
        """
        try:
            # Run blocking boto3 call in thread pool
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                partial(
                    self.s3_client.put_object,
                    Bucket=self.bucket_name,
                    Key=file_name,
                    Body=file_content,
                    ContentType=content_type
                )
            )
            
            # Generate public URL
            url = f"https://{self.bucket_name}.{self.s3_client.meta.endpoint_url.split('//')[1]}/{file_name}"
            
            return {
                'file_id': response.get('ETag', '').strip('"'),
                'file_name': file_name,
                'url': url
            }
        except ClientError as e:
            logger.error(f"Error uploading file to B2: {e}")
            raise Exception(f"Failed to upload file: {str(e)}")
    
    async def generate_presigned_upload_url(self, file_name: str, expires_in: int = 3600) -> dict:
        """
        Generate presigned URL for uploading files directly to B2
        
        Args:
            file_name: Name/path for the file
            expires_in: URL expiration time in seconds (default 1 hour)
            
        Returns:
            dict with upload_url, upload_id, and expires_in
        """
        try:
            presigned_url = self.s3_client.generate_presigned_url(
                'put_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': file_name
                },
                ExpiresIn=expires_in
            )
            
            return {
                'upload_url': presigned_url,
                'upload_id': file_name,
                'expires_in': expires_in
            }
        except ClientError as e:
            logger.error(f"Error generating presigned upload URL: {e}")
            raise Exception(f"Failed to generate presigned URL: {str(e)}")
    
    async def generate_presigned_download_url(self, file_name: str, expires_in: int = 3600) -> dict:
        """
        Generate presigned URL for downloading files from B2
        
        Args:
            file_name: Name/path of the file
            expires_in: URL expiration time in seconds (default 1 hour)
            
        Returns:
            dict with signed_url and expires_in
        """
        try:
            presigned_url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': file_name
                },
                ExpiresIn=expires_in
            )
            
            return {
                'signed_url': presigned_url,
                'expires_in': expires_in
            }
        except ClientError as e:
            logger.error(f"Error generating presigned download URL: {e}")
            raise Exception(f"Failed to generate presigned download URL: {str(e)}")
    
    async def file_exists(self, file_name: str) -> bool:
        """
        Check if a file exists in B2
        
        Args:
            file_name: Name/path of the file
            
        Returns:
            bool indicating if file exists
        """
        try:
            self.s3_client.head_object(Bucket=self.bucket_name, Key=file_name)
            return True
        except ClientError as e:
            if e.response['Error']['Code'] == '404':
                return False
            logger.error(f"Error checking file existence: {e}")
            raise Exception(f"Failed to check file existence: {str(e)}")
    
    async def delete_file(self, file_name: str) -> bool:
        """
        Delete a file from B2
        
        Args:
            file_name: Name/path of the file
            
        Returns:
            bool indicating success
        """
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=file_name)
            return True
        except ClientError as e:
            logger.error(f"Error deleting file: {e}")
            raise Exception(f"Failed to delete file: {str(e)}")
    
    async def list_files(self, prefix: str = '', max_keys: int = 1000) -> list:
        """
        List files in B2 bucket
        
        Args:
            prefix: Filter files by prefix
            max_keys: Maximum number of files to return
            
        Returns:
            list of file objects
        """
        try:
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix=prefix,
                MaxKeys=max_keys
            )
            
            files = []
            if 'Contents' in response:
                for obj in response['Contents']:
                    files.append({
                        'key': obj['Key'],
                        'size': obj['Size'],
                        'last_modified': obj['LastModified'].isoformat(),
                        'etag': obj['ETag'].strip('"')
                    })
            
            return files
        except ClientError as e:
            logger.error(f"Error listing files: {e}")
            raise Exception(f"Failed to list files: {str(e)}")
    
    async def download_file(self, file_name: str) -> bytes:
        """
        Download file content from B2
        
        Args:
            file_name: Name/path of the file
            
        Returns:
            bytes of file content
        """
        try:
            response = self.s3_client.get_object(Bucket=self.bucket_name, Key=file_name)
            return response['Body'].read()
        except ClientError as e:
            logger.error(f"Error downloading file: {e}")
            raise Exception(f"Failed to download file: {str(e)}")


# Thread-safe singleton
import threading

_b2_client: Optional[B2Client] = None
_b2_lock = threading.Lock()


def get_b2_client() -> B2Client:
    """Get or create B2 client instance (thread-safe)"""
    global _b2_client
    if _b2_client is None:
        with _b2_lock:
            if _b2_client is None:
                _b2_client = B2Client()
    return _b2_client
