import time
from typing import Any, Dict, Optional, Tuple

class SimpleCache:
    """A simple in-memory cache with Time-To-Live (TTL) functionality."""

    def __init__(self, default_ttl: int = 300):
        """Initialize cache with a default TTL (5 minutes)."""
        self.default_ttl = default_ttl
        self._cache: Dict[str, Tuple[Any, float]] = {}

    def get(self, key: str) -> Optional[Any]:
        """Retrieve a value from the cache if it exists and hasn't expired."""
        if key not in self._cache:
            return None

        value, expiry_time = self._cache[key]
        if time.time() > expiry_time:
            del self._cache[key]
            return None

        return value

    def set(self, key: str, value: Any, ttl: Optional[int] = None):
        """Store a value in the cache with a specific or default TTL."""
        ttl = ttl if ttl is not None else self.default_ttl
        expiry_time = time.time() + ttl
        self._cache[key] = (value, expiry_time)

    def delete(self, key: str) -> bool:
        """Remove a specific key from the cache."""
        if key in self._cache:
            del self._cache[key]
            return True
        return False

    def clear(self):
        """Clear all items from the cache."""
        self._cache.clear()

