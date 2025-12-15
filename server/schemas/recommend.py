from pydantic import BaseModel
from typing import List, Optional, Dict


class RecommendationRequest(BaseModel):
    project_description: str
    requirements: List[str] = []
    constraints: Optional[Dict] = {}
    limit: int = 10


class TechRecommendation(BaseModel):
    tech_id: str
    tech_name: str
    similarity_score: float
    category: str
    reason: str


class RecommendationResponse(BaseModel):
    recommendations: List[TechRecommendation]
    total_candidates: int
    query_embedding_dimensions: int
