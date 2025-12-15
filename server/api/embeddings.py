from fastapi import APIRouter, Depends
from schemas.embeddings import (
    TechEmbeddingRequest, TechEmbeddingResponse,
    ProjectEmbeddingRequest, ProjectEmbeddingResponse
)
from middleware.internal_auth import verify_internal_key

router = APIRouter()


@router.post("/tech", response_model=TechEmbeddingResponse, dependencies=[Depends(verify_internal_key)])
async def generate_tech_embedding(request: TechEmbeddingRequest):
    """Generate vector embedding for technology"""
    # TODO: Implement via lib/embeddings_client.py
    # Mock 1536-dimensional embedding (OpenAI text-embedding-3-small)
    mock_embedding = [0.0] * 1536
    return TechEmbeddingResponse(
        tech_name=request.tech_name,
        embedding=mock_embedding,
        dimensions=1536
    )


@router.post("/project", response_model=ProjectEmbeddingResponse, dependencies=[Depends(verify_internal_key)])
async def generate_project_embedding(request: ProjectEmbeddingRequest):
    """Generate vector embedding for project description"""
    # TODO: Implement via lib/embeddings_client.py
    # Mock 1536-dimensional embedding
    mock_embedding = [0.0] * 1536
    return ProjectEmbeddingResponse(
        embedding=mock_embedding,
        dimensions=1536
    )
