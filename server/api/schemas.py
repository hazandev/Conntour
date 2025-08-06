from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID, uuid4

class ImageItem(BaseModel):
    title: str
    description: Optional[str] = None
    url: str
    date_created: datetime
    keywords: List[str]
    confidence: Optional[float] = None

class SearchQuery(BaseModel):
    query: str = Field(..., min_length=1, description="The search term for images.")

class SearchHistoryEntry(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    query: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    results: List[ImageItem]

