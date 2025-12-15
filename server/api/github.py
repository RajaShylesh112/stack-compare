
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "FastAPI working on Vercel"}
from fastapi import APIRouter, Depends, HTTPException
from schemas.github import (
    RepoStatsRequest, RepoStatsResponse,
    ReadmeRequest, ReadmeResponse,
    WriteRequest, WriteResponse,
    ReadRequest, ReadResponse
)
from middleware.internal_auth import verify_internal_key
from middleware.user_auth import verify_user_token
from lib.github_client import get_github_client

router = APIRouter()


@router.post("/repo-stats", response_model=RepoStatsResponse, dependencies=[Depends(verify_internal_key)])
async def get_repo_stats(request: RepoStatsRequest):
    """Fetch repository statistics (stars, forks, issues, etc.)"""
    try:
        github = get_github_client()
        result = await github.get_repo_stats(request.owner, request.repo)
        return RepoStatsResponse(**result)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch repository statistics")


@router.post("/readme", response_model=ReadmeResponse, dependencies=[Depends(verify_internal_key)])
async def fetch_readme(request: ReadmeRequest):
    """Fetch and decode README.md from repository"""
    try:
        github = get_github_client()
        result = await github.get_readme(request.owner, request.repo)
        return ReadmeResponse(
            content=result["content"],
            encoding=result.get("encoding", "utf-8"),
            size=result["size"],
            sha=result["sha"]
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch README")


@router.post("/write", response_model=WriteResponse, dependencies=[Depends(verify_internal_key)])
async def write_file(request: WriteRequest):
    """Write README or metadata file to repository"""
    try:
        github = get_github_client()
        result = await github.write_file(
            owner=request.owner,
            repo=request.repo,
            path=request.path,
            content=request.content,
            message=request.message,
            branch=request.branch
        )
        return WriteResponse(
            commit_sha=result["commit_sha"],
            content_sha=result["content_sha"],
            html_url=result["url"]
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to write file")


@router.get("/read", response_model=ReadResponse, dependencies=[Depends(verify_user_token)])
async def read_file(owner: str, repo: str, path: str):
    """Frontend-safe metadata fetch"""
    try:
        github = get_github_client()
        result = await github.read_file(owner, repo, path)
        return ReadResponse(
            content=result["content"],
            sha=result["sha"],
            size=result["size"]
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to read file")
