from pydantic import BaseModel, HttpUrl
from typing import Optional


class RepoStatsRequest(BaseModel):
    owner: str
    repo: str


class RepoStatsResponse(BaseModel):
    stars: int
    forks: int
    open_issues: int
    default_branch: str
    watchers: int
    language: Optional[str]
    created_at: str
    updated_at: str


class ReadmeRequest(BaseModel):
    owner: str
    repo: str
    branch: Optional[str] = "main"


class ReadmeResponse(BaseModel):
    content: str
    encoding: str
    size: int
    sha: str


class WriteRequest(BaseModel):
    owner: str
    repo: str
    path: str
    content: str
    message: str
    branch: Optional[str] = "main"
    sha: Optional[str] = None  # For file updates

class WriteResponse(BaseModel):
    commit_sha: str
    content_sha: str
    html_url: HttpUrl


class ReadRequest(BaseModel):
    owner: str
    repo: str
    path: str
    branch: Optional[str] = "main"


class ReadResponse(BaseModel):
    content: str
    sha: str
    size: int
