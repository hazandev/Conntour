import json
from typing import List, Any, Optional
from uuid import UUID
from pathlib import Path
import aiofiles
from api.schemas import SearchHistoryEntry

HISTORY_FILE = Path(__file__).parent.parent / "data" / "history.json"

async def load_history() -> List[SearchHistoryEntry]:
    """Reads the search history file and returns a list of Pydantic models."""
    if not HISTORY_FILE.exists():
        return []
    async with aiofiles.open(HISTORY_FILE, 'r', encoding='utf-8') as f:
        content = await f.read()
        if not content:
            return []
        data = json.loads(content)
        return [SearchHistoryEntry(**item) for item in data]

async def write_history(data: List[SearchHistoryEntry]):
    """Writes a list of Pydantic models to the search history file."""
    export_data = [item.model_dump(mode='json') for item in data]
    async with aiofiles.open(HISTORY_FILE, 'w', encoding='utf-8') as f:
        await f.write(json.dumps(export_data, indent=2))

async def save_search(entry: SearchHistoryEntry):
    """Saves a new search entry to the history."""
    history = await load_history()
    history.insert(0, entry)  # Prepend to keep it sorted by newest
    await write_history(history)

async def get_history(page: int, limit: int) -> List[SearchHistoryEntry]:
    """Returns a paginated list of search history."""
    history = await load_history()
    start = (page - 1) * limit
    end = start + limit
    return history[start:end]

async def delete_search(search_id: UUID) -> bool:
    """Deletes a search entry by its UUID."""
    history = await load_history()
    
    original_count = len(history)
    
    # Filter out the entry to be deleted
    history_after_delete = [entry for entry in history if entry.id != search_id]
    
    if len(history_after_delete) < original_count:
        await write_history(history_after_delete)
        return True
    
    return False
