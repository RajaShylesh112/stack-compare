from pydantic import BaseModel
from typing import Optional, List, Dict


class PackageRequest(BaseModel):
    platform: str  # npm, pypi, maven, etc.
    package_name: str


class PackageResponse(BaseModel):
    name: str
    platform: str
    description: Optional[str]
    homepage: Optional[str]
    repository_url: Optional[str]
    stars: int
    forks: int
    dependents_count: int
    language: Optional[str]
    latest_release_number: Optional[str]
    latest_release_published_at: Optional[str]


class DependentsRequest(BaseModel):
    platform: str
    package_name: str


class DependentsResponse(BaseModel):
    package: str
    platform: str
    dependents_count: int
    dependents: List[Dict] = []


class PlatformStatsRequest(BaseModel):
    platform: str


class PlatformStatsResponse(BaseModel):
    platform: str
    total_projects: int
    updated_recently: int
