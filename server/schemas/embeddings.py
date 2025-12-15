from pydantic import BaseModel
from typing import List


class TechEmbeddingRequest(BaseModel):
    tech_name: str
    description: str


class TechEmbeddingResponse(BaseModel):
    tech_name: str
    embedding: List[float]
    dimensions: int


class ProjectEmbeddingRequest(BaseModel):
    project_description: str
    requirements: List[str] = []


class ProjectEmbeddingResponse(BaseModel):
    embedding: List[float]
    dimensions: int
