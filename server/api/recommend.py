from fastapi import APIRouter, Depends
from schemas.recommend import (
    RecommendationRequest,
    RecommendationResponse,
    TechRecommendation
)
from middleware.internal_auth import verify_internal_key

router = APIRouter()


@router.post("", response_model=RecommendationResponse, dependencies=[Depends(verify_internal_key)])
async def get_recommendations(request: RecommendationRequest):
    """
    Embed project text, run pgvector similarity search, return ranked technologies/stacks
    """
    # TODO: 
    # 1. Generate embedding via lib/embeddings_client.py
    # 2. Query pgvector via lib/db.py for cosine similarity
    # 3. Optionally rerank via lib/ai_client.py
    # 4. Return top N results
    
    mock_recommendations = [
        TechRecommendation(
            tech_id="tech_1",
            tech_name="React",
            similarity_score=0.95,
            category="Frontend Framework",
            reason="Best match for interactive web applications"
        ),
        TechRecommendation(
            tech_id="tech_2",
            tech_name="FastAPI",
            similarity_score=0.89,
            category="Backend Framework",
            reason="High-performance async Python framework"
        )
    ]
    
    return RecommendationResponse(
        recommendations=mock_recommendations[:request.limit],
        total_candidates=50,
        query_embedding_dimensions=1536
    )
