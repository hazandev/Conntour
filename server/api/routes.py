from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime
from uuid import UUID
from api.schemas import ImageItem, SearchQuery, SearchHistoryEntry
from services import image_service, search_service, history_service

router = APIRouter()

@router.get("/ping", tags=["Health"])
async def ping():
    """Health check endpoint."""
    return {"status": "ok"}

@router.get("/sources", response_model=List[ImageItem], tags=["Images"])
async def get_sources(
    from_date: Optional[datetime] = Query(None, description="ISO date to filter from"),
    to_date: Optional[datetime] = Query(None, description="ISO date to filter to"),
    keywords: Optional[str] = Query(None, description="Comma-separated keywords")
):
    """Retrieve all images, with optional filtering."""
    images_data = await image_service.get_all_images(from_date, to_date, keywords)
    return [ImageItem(**img) for img in images_data]

@router.post("/search", response_model=List[ImageItem], tags=["Search"])
async def search(search_query: SearchQuery):
    """Search for images, score them, and save the search to history."""
    if not search_query.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    return await search_service.search_images(search_query.query)

@router.get("/history", response_model=List[SearchHistoryEntry], tags=["History"])
async def get_history_paginated(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
):
    """Get paginated search history."""
    return await history_service.get_history(page, limit)

@router.delete("/history/{search_id}", status_code=204, tags=["History"])
async def delete_history_entry(search_id: UUID):
    """Delete a specific search entry by its ID."""
    success = await history_service.delete_search(search_id)
    if not success:
        raise HTTPException(status_code=404, detail="Search entry not found.")
    return None

