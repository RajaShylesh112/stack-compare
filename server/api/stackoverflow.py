from fastapi import APIRouter, Depends
from schemas.stackoverflow import (
    TagsRequest, TagsResponse, TagInfo,
    ActivityRequest, ActivityResponse
)
from middleware.internal_auth import verify_internal_key

router = APIRouter()


@router.post("/tags", response_model=TagsResponse, dependencies=[Depends(verify_internal_key)])
async def get_tag_counts(request: TagsRequest):
    """Fetch tag question counts"""
    # TODO: Implement via lib/stackoverflow_client.py
    items = [
        TagInfo(name=tag, count=1000, has_synonyms=False)
        for tag in request.tags
    ]
    return TagsResponse(items=items)


@router.post("/activity", response_model=ActivityResponse, dependencies=[Depends(verify_internal_key)])
async def get_tag_activity(request: ActivityRequest):
    """Fetch activity trend for a tag"""
    # TODO: Implement via lib/stackoverflow_client.py
    return ActivityResponse(
        tag=request.tag,
        question_count=500,
        answer_count=1200,
        trending_score=0.85
    )
