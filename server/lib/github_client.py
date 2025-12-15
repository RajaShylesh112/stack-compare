"""
GitHub API client
Handles repository stats, README fetching, and file operations
"""
import httpx
from settings import get_settings
from typing import Optional
import logging
import base64

logger = logging.getLogger(__name__)


class GitHubClient:
    """GitHub API client"""
    
    def __init__(self):
        settings = get_settings()
        self.base_url = "https://api.github.com"
        self.token = settings.github_token.get_secret_value()
        self.headers = {
            "Authorization": f"token {self.token}",
            "Accept": "application/vnd.github.v3+json"
        }
    
    async def get_repo_stats(self, owner: str, repo: str) -> dict:
        """
        Get repository statistics from GitHub
        
        Args:
            owner: Repository owner/organization
            repo: Repository name
            
        Returns:
            dict with repository statistics
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/repos/{owner}/{repo}",
                    headers=self.headers,
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()
                
                return {
                    "stars": data.get("stargazers_count", 0),
                    "forks": data.get("forks_count", 0),
                    "open_issues": data.get("open_issues_count", 0),
                    "default_branch": data.get("default_branch", "main"),
                    "watchers": data.get("watchers_count", 0),
                    "language": data.get("language", "Unknown"),
                    "created_at": data.get("created_at", ""),
                    "updated_at": data.get("updated_at", ""),
                    "description": data.get("description", ""),
                    "homepage": data.get("homepage", ""),
                    "topics": data.get("topics", [])
                }
        except httpx.HTTPError as e:
            logger.error(f"GitHub API error for {owner}/{repo}: {e}")
            raise Exception(f"Failed to fetch repo stats: {str(e)}")
    
    async def get_readme(self, owner: str, repo: str) -> dict:
        """
        Fetch and decode README from repository
        
        Args:
            owner: Repository owner/organization
            repo: Repository name
            
        Returns:
            dict with README content and metadata
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/repos/{owner}/{repo}/readme",
                    headers=self.headers,
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()
                
                # Decode base64 content
                content = base64.b64decode(data.get("content", "")).decode("utf-8")
                
                return {
                    "content": content,
                    "name": data.get("name", "README.md"),
                    "path": data.get("path", ""),
                    "sha": data.get("sha", ""),
                    "size": data.get("size", 0),
                    "url": data.get("html_url", ""),
                    "encoding": data.get("encoding", "utf-8")
                }
        except httpx.HTTPError as e:
            logger.error(f"GitHub README fetch error for {owner}/{repo}: {e}")
            raise Exception(f"Failed to fetch README: {str(e)}")
    
    async def write_file(self, owner: str, repo: str, path: str, content: str, message: str, branch: str = "main") -> dict:
        """
        Write or update a file in repository
        
        Args:
            owner: Repository owner
            repo: Repository name
            path: File path in repo
            content: File content (will be base64 encoded)
            message: Commit message
            branch: Target branch
            
        Returns:
            dict with commit information
        """
        try:
            # Encode content to base64
            encoded_content = base64.b64encode(content.encode("utf-8")).decode("utf-8")
            
            async with httpx.AsyncClient() as client:
                # Check if file exists to get SHA
                sha = None
                try:
                    check_response = await client.get(
                        f"{self.base_url}/repos/{owner}/{repo}/contents/{path}",
                        headers=self.headers,
                        timeout=10.0
                    )
                    if check_response.status_code == 200:
                        sha = check_response.json().get("sha")
                except (httpx.HTTPError, ValueError, KeyError):
                    # File doesn't exist, will create new
                    pass
                
                # Create or update file
                payload = {
                    "message": message,
                    "content": encoded_content,
                    "branch": branch
                }
                if sha:
                    payload["sha"] = sha
                
                response = await client.put(
                    f"{self.base_url}/repos/{owner}/{repo}/contents/{path}",
                    headers=self.headers,
                    json=payload,
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()
                
                return {
                    "commit_sha": data.get("commit", {}).get("sha", ""),
                    "content_sha": data.get("content", {}).get("sha", ""),
                    "message": message,
                    "url": data.get("content", {}).get("html_url", "")
                }
        except httpx.HTTPError as e:
            logger.error(f"GitHub write error for {owner}/{repo}/{path}: {e}")
            raise Exception(f"Failed to write file: {str(e)}")
    
    async def read_file(self, owner: str, repo: str, path: str) -> dict:
        """
        Read file from repository
        
        Args:
            owner: Repository owner
            repo: Repository name
            path: File path in repo
            
        Returns:
            dict with file content and metadata
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/repos/{owner}/{repo}/contents/{path}",
                    headers=self.headers,
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()
                
                # Decode base64 content
                try:
                    content = base64.b64decode(data.get("content", "")).decode("utf-8")
                except (ValueError, UnicodeDecodeError) as e:
                    logger.error(f"Failed to decode file content: {e}")
                    raise Exception("Failed to decode file content")
                
                return {
                    "content": content,
                    "name": data.get("name", ""),
                    "path": data.get("path", ""),
                    "sha": data.get("sha", ""),
                    "size": data.get("size", 0),
                    "url": data.get("html_url", "")
                }
        except httpx.HTTPError as e:
            logger.error(f"GitHub read error for {owner}/{repo}/{path}: {e}")
            raise Exception(f"Failed to read file: {str(e)}")


# Thread-safe singleton
import threading

_github_client: Optional[GitHubClient] = None
_github_lock = threading.Lock()


def get_github_client() -> GitHubClient:
    """Get or create GitHub client instance (thread-safe)"""
    global _github_client
    if _github_client is None:
        with _github_lock:
            if _github_client is None:
                _github_client = GitHubClient()
    return _github_client
