from fastapi import APIRouter, Depends
from schemas.libraries import (
    PackageRequest, PackageResponse,
    DependentsRequest, DependentsResponse,
    PlatformStatsRequest, PlatformStatsResponse
)
from middleware.internal_auth import verify_internal_key

router = APIRouter()


@router.post("/package", response_model=PackageResponse, dependencies=[Depends(verify_internal_key)])
async def get_package_info(request: PackageRequest):
    """Fetch ecosystem metadata from Libraries.io"""
    # TODO: Implement via lib/libraries_client.py
    return PackageResponse(
        name=request.package_name,
        platform=request.platform,
        description="Sample package",
        homepage="https://example.com",
        repository_url="https://github.com/example/repo",
        stars=100,
        forks=50,
        dependents_count=10,
        language="Python",
        latest_release_number="1.0.0",
        latest_release_published_at="2025-12-07"
    )


@router.post("/dependents", response_model=DependentsResponse, dependencies=[Depends(verify_internal_key)])
async def get_dependents(request: DependentsRequest):
    """Fetch reverse dependency graph"""
    # TODO: Implement via lib/libraries_client.py
    return DependentsResponse(
        package=request.package_name,
        platform=request.platform,
        dependents_count=0,
        dependents=[]
    )


@router.post("/platform", response_model=PlatformStatsResponse, dependencies=[Depends(verify_internal_key)])
async def get_platform_stats(request: PlatformStatsRequest):
    """Fetch ecosystem size statistics"""
    # TODO: Implement via lib/libraries_client.py
    return PlatformStatsResponse(
        platform=request.platform,
        total_projects=10000,
        updated_recently=5000
    )
