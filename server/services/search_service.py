import httpx
from typing import List
from datetime import datetime
from api.schemas import ImageItem, SearchHistoryEntry
from services import history_service
from utils.scorer import compute_confidence

NASA_API_URL = "https://images-api.nasa.gov/search"

async def fetch_images_from_nasa(query: str) -> List[ImageItem]:
    """
    Fetches and parses image data from the NASA API based on a query.
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(NASA_API_URL, params={'q': query, 'media_type': 'image'})
            response.raise_for_status()
            data = response.json()
        except httpx.HTTPStatusError as e:
            # Handle non-2xx responses
            print(f"Error fetching data from NASA API: {e}")
            return []
        except httpx.RequestError as e:
            # Handle network-related errors
            print(f"A network error occurred: {e}")
            return []

    items = data.get('collection', {}).get('items', [])
    parsed_images = []

    for item in items[:50]:  # Limit to 50 results
        item_data = item.get('data', [{}])[0]
        item_links = item.get('links', [{}])

        # Find the image URL (thumbnail or original)
        image_url = next((link.get('href') for link in item_links if link.get('rel') == 'preview'), None)
        if not image_url:
            continue # Skip if no image URL

        # Defensive parsing for date
        try:
            date_created = datetime.fromisoformat(item_data.get('date_created', '').replace('Z', '+00:00'))
        except (ValueError, TypeError):
            date_created = datetime.utcnow() # Fallback

        parsed_images.append(ImageItem(
            title=item_data.get('title', 'No Title'),
            description=item_data.get('description', 'No Description'),
            url=image_url,
            date_created=date_created,
            keywords=item_data.get('keywords', []),
        ))
        
    return parsed_images

async def search_images(query: str) -> List[ImageItem]:
    """
    Performs a real-time search using the NASA API, scores the results,
    and saves the search to history if any results are found.
    """
    nasa_images = await fetch_images_from_nasa(query)
    
    # Save to history if there are any results from NASA
    if nasa_images:
        history_entry = SearchHistoryEntry(query=query, results=nasa_images)
        await history_service.save_search(history_entry)

    scored_images = []
    for image in nasa_images:
        confidence = compute_confidence(
            query=query,
            image_title=image.title,
            image_description=image.description or '',
            image_keywords=image.keywords
        )
        image.confidence = confidence
        scored_images.append(image)

    # Sort by confidence
    scored_images.sort(key=lambda img: img.confidence, reverse=True)
    
    return scored_images
