from pydantic import BaseModel
from typing import List, Optional


class TagsRequest(BaseModel):
    tags: List[str]


class TagInfo(BaseModel):
    name: str
    count: int
    has_synonyms: bool


class TagsResponse(BaseModel):
    items: List[TagInfo]


class ActivityRequest(BaseModel):
    tag: str
    from_date: Optional[str] = None
    to_date: Optional[str] = None


class ActivityResponse(BaseModel):
    tag: str
    question_count: int
    answer_count: int
    trending_score: float
