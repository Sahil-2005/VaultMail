import os
import uuid
import zipfile
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue
from langchain_text_splitters import MarkdownTextSplitter
from sentence_transformers import SentenceTransformer
from app.config import settings
from app.utils.markdown_parser import parse_markdown

embedder = SentenceTransformer("all-MiniLM-L6-v2")

qdrant = QdrantClient(url=settings.QDRANT_URL, api_key=settings.QDRANT_API_KEY if settings.QDRANT_API_KEY else None)
COLLECTION_NAME = "vault_notes"

def init_qdrant():
    try:
        qdrant.get_collection(COLLECTION_NAME)
    except Exception:
        qdrant.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=384, distance=Distance.COSINE),
        )
        
    try:
        qdrant.create_payload_index(
            collection_name=COLLECTION_NAME,
            field_name="user_id",
            field_schema="keyword"
        )
    except Exception:
        pass

    try:
        qdrant.create_payload_index(
            collection_name=COLLECTION_NAME,
            field_name="vault_id",
            field_schema="keyword"
        )
    except Exception:
        pass

init_qdrant()

def delete_user_vault_points(user_id: str):
    """Deletes all Qdrant points belonging to a specific user."""
    try:
        qdrant.delete(
            collection_name=COLLECTION_NAME,
            points_selector=Filter(
                must=[
                    FieldCondition(
                        key="user_id",
                        match=MatchValue(value=user_id)
                    )
                ]
            )
        )
    except Exception as e:
        print(f"Error deleting user points: {e}")

def process_vault_zip(zip_path: str, extract_to: str, user_id: str, vault_id: str):
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_to)
    
    splitter = MarkdownTextSplitter(chunk_size=800, chunk_overlap=200)
    
    points = []
    num_files = 0
    num_chunks = 0
    
    for root, _, files in os.walk(extract_to):
        for file in files:
            if file.endswith(".md"):
                num_files += 1
                filepath = os.path.join(root, file)
                rel_path = os.path.relpath(filepath, extract_to)
                
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                
                parsed = parse_markdown(content)
                text_content = parsed["content"]
                metadata = parsed["metadata"]
                
                note_title = file.replace(".md", "")
                
                chunks = splitter.create_documents([text_content])
                
                for i, chunk in enumerate(chunks):
                    chunk_text = chunk.page_content
                    embedding = embedder.encode(chunk_text).tolist()
                    
                    point_id = str(uuid.uuid4())
                    points.append(
                        PointStruct(
                            id=point_id,
                            vector=embedding,
                            payload={
                                "user_id": user_id,
                                "vault_id": vault_id,
                                "source_file": rel_path,
                                "note_title": note_title,
                                "chunk_index": i,
                                "tags": metadata.get("tags", []),
                                "text": chunk_text
                            }
                        )
                    )
                    num_chunks += 1
    
    if points:
        # Delete old points for this user first
        delete_user_vault_points(user_id)
        # Upload new points
        qdrant.upload_points(collection_name=COLLECTION_NAME, points=points)

    return {"num_files": num_files, "num_chunks": num_chunks}
