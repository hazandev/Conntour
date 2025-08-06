import re
from typing import List

def compute_confidence(query: str, image_title: str, image_description: str, image_keywords: List[str]) -> float:
    """
    Computes a confidence score based on keyword overlap in title, description, and keywords.
    """
    if not query.strip():
        return 0.0

    query_terms = set(re.findall(r'\w+', query.lower()))
    if not query_terms:
        return 0.0

    # Weights for different fields
    weights = {'keywords': 0.6, 'title': 0.3, 'description': 0.1}
    
    # Text from different fields
    text_sources = {
        'keywords': ' '.join(image_keywords),
        'title': image_title,
        'description': image_description
    }

    total_score = 0.0
    for field, weight in weights.items():
        field_text = text_sources.get(field, '').lower()
        field_words = set(re.findall(r'\w+', field_text))
        matches = query_terms.intersection(field_words)
        
        # Score is the proportion of matching query terms
        score = len(matches) / len(query_terms)
        total_score += score * weight

    return min(round(total_score, 4), 1.0)

