import json
from typing import List, Dict, Any, Optional
from datetime import datetime
from pathlib import Path
from utils.cache import SimpleCache
import aiofiles

# Cache for image data with a 5-minute TTL
_image_cache = SimpleCache(default_ttl=300)
DATA_FILE = Path(__file__).parent.parent / "data" / "images_mock.json"

async def load_images_from_file() -> List[Dict[str, Any]]:
    """Asynchronously load images from the mock JSON file."""
    async with aiofiles.open(DATA_FILE, 'r', encoding='utf-8') as f:
        content = await f.read()
        return json.loads(content)

async def get_all_images(
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    keywords: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Load all images, with optional filtering, using a cache.
    """
    cache_key = f"images_{from_date}_{to_date}_{keywords}"
    cached_data = _image_cache.get(cache_key)
    if cached_data:
        return cached_data

    images = await load_images_from_file()

    # Filter by date range
    if from_date:
        images = [img for img in images if datetime.fromisoformat(img['date_created'].replace('Z', '+00:00')) >= from_date]
    if to_date:
        images = [img for img in images if datetime.fromisoformat(img['date_created'].replace('Z', '+00:00')) <= to_date]

    # Filter by keywords
    if keywords:
        filter_keywords = {kw.strip().lower() for kw in keywords.split(',')}
        images = [img for img in images if filter_keywords.intersection(kw.lower() for kw in img['keywords'])]

    _image_cache.set(cache_key, images)
    return images

