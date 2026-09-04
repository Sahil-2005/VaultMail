import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from app.services.vault_service import process_vault_zip

router = APIRouter(prefix="/api/vault", tags=["vault"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

class UploadResponse(BaseModel):
    status: str
    num_files: int
    num_chunks: int

@router.post("/upload", response_model=UploadResponse)
async def upload_vault(file: UploadFile = File(...)):
    if not file.filename.endswith('.zip'):
        raise HTTPException(status_code=400, detail="Only .zip files are supported")
    
    if os.path.exists(UPLOAD_DIR):
        shutil.rmtree(UPLOAD_DIR)
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    zip_path = os.path.join(UPLOAD_DIR, "vault.zip")
    extract_to = os.path.join(UPLOAD_DIR, "extracted")
    
    with open(zip_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        result = process_vault_zip(zip_path, extract_to)
        return {
            "status": "success",
            "num_files": result["num_files"],
            "num_chunks": result["num_chunks"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/notes")
async def list_notes():
    extract_to = os.path.join(UPLOAD_DIR, "extracted")
    notes = []
    if not os.path.exists(extract_to):
        return notes
        
    for root, _, files in os.walk(extract_to):
        for file in files:
            if file.endswith(".md"):
                rel_path = os.path.relpath(os.path.join(root, file), extract_to)
                # Keep it simple for now, just returning titles and paths
                notes.append({
                    "title": file.replace(".md", ""),
                    "filename": rel_path.replace("\\", "/")
                })
    return notes

@router.get("/notes/{filename:path}")
async def get_note(filename: str):
    extract_to = os.path.join(UPLOAD_DIR, "extracted")
    filepath = os.path.join(extract_to, filename)
    
    # Basic security check
    if not os.path.abspath(filepath).startswith(os.path.abspath(extract_to)):
        raise HTTPException(status_code=403, detail="Invalid path")
        
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Note not found")
        
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
        
    return {
        "title": os.path.basename(filename).replace(".md", ""),
        "content": content
    }

