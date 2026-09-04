from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
from app.config import settings

# Use the same embedder
embedder = SentenceTransformer("all-MiniLM-L6-v2")

qdrant = QdrantClient(url=settings.QDRANT_URL, api_key=settings.QDRANT_API_KEY if settings.QDRANT_API_KEY else None)
COLLECTION_NAME = "vault_notes"

def search_vault_chunks(query: str, limit: int = 5):
    """
    Search the vault for relevant chunks based on semantic similarity.
    """
    query_vector = embedder.encode(query).tolist()
    
    try:
        search_result = qdrant.search(
            collection_name=COLLECTION_NAME,
            query_vector=query_vector,
            limit=limit
        )
        
        results = []
        for hit in search_result:
            results.append({
                "note_title": hit.payload.get("note_title", ""),
                "source_file": hit.payload.get("source_file", ""),
                "text": hit.payload.get("text", ""),
                "score": hit.score
            })
            
        return results
    except Exception as e:
        print(f"Error querying Qdrant: {e}")
        return []
