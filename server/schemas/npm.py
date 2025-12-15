from pydantic import BaseModel, HttpUrl
from typing import Optional, Dict, List


class PackageRequest(BaseModel):
    package_name: str


class PackageResponse(BaseModel):
    name: str
    version: str
    description: Optional[str]
    author: Optional[str]
    license: Optional[str]
    homepage: Optional[HttpUrl]
    repository: Optional[Dict]
    keywords: List[str] = []
    dependencies: Dict[str, str] = {}


class DownloadsRequest(BaseModel):
    package_name: str
    period: str = "last-week"  # last-day, last-week, last-month


class DownloadsResponse(BaseModel):
    downloads: int
    package: str
    start: str
    end: str


class DepsRequest(BaseModel):
    package_name: str
    version: Optional[str] = "latest"


class DepsResponse(BaseModel):
    package: str
    version: str
    dependencies: Dict[str, str]
    dev_dependencies: Dict[str, str]
    peer_dependencies: Dict[str, str]
