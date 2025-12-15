from pydantic import BaseModel
from typing import List, Dict, Optional


class EnrichTechRequest(BaseModel):
    tech_name: str
    context: Optional[str] = None


class EnrichTechResponse(BaseModel):
    tagline: str
    pros: List[str]
    cons: List[str]
    features: List[str]
    metrics: Dict[str, str]
    use_cases: List[str]


class EnrichStackRequest(BaseModel):
    technologies: List[str]
    project_type: Optional[str] = None


class EnrichStackResponse(BaseModel):
    compatibility_score: float
    strengths: List[str]
    weaknesses: List[str]
    recommendations: List[str]


class RerankRequest(BaseModel):
    query: str
    candidates: List[Dict]


class RerankResponse(BaseModel):
    ranked_results: List[Dict]
    scores: List[float]
