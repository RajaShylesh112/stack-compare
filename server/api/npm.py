from fastapi import APIRouter, Depends
from schemas.npm import (
    PackageRequest, PackageResponse,
    DownloadsRequest, DownloadsResponse,
    DepsRequest, DepsResponse
)
from middleware.internal_auth import verify_internal_key

router = APIRouter()


@router.post("/package", response_model=PackageResponse, dependencies=[Depends(verify_internal_key)])
async def get_package_metadata(request: PackageRequest):
    """Fetch npm package metadata from registry"""
    # TODO: Implement via lib/npm_client.py
    return PackageResponse(
        name=request.package_name,
        version="1.0.0",
        description="Sample package",
        author="Author",
        license="MIT",
        homepage="https://example.com",
        repository={},
        keywords=[],
        dependencies={}
    )


@router.post("/downloads", response_model=DownloadsResponse, dependencies=[Depends(verify_internal_key)])
async def get_download_stats(request: DownloadsRequest):
    """Fetch npm download statistics"""
    # TODO: Implement via lib/npm_client.py
    return DownloadsResponse(
        downloads=10000,
        package=request.package_name,
        start="2025-12-01",
        end="2025-12-07"
    )


@router.post("/deps", response_model=DepsResponse, dependencies=[Depends(verify_internal_key)])
async def get_dependency_tree(request: DepsRequest):
    """Fetch package dependency tree"""
    # TODO: Implement via lib/npm_client.py
    return DepsResponse(
        package=request.package_name,
        version="1.0.0",
        dependencies={},
        dev_dependencies={},
        peer_dependencies={}
    )
