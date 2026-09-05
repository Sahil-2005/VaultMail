import os
import shutil
import uuid
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pydantic import BaseModel
from app.services.vault_service import process_vault_zip
from app.services.database import db
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/vault", tags=["vault"])

BASE_UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "uploads")
os.makedirs(BASE_UPLOAD_DIR, exist_ok=True)

class UploadResponse(BaseModel):
    status: str
    num_files: int
    num_chunks: int

@router.post("/upload", response_model=UploadResponse)
async def upload_vault(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    if not file.filename.endswith('.zip'):
        raise HTTPException(status_code=400, detail="Only .zip files are supported")
    
    user_id = current_user["id"]
    new_vault_id = str(uuid.uuid4())
    
    user_upload_dir = os.path.join(BASE_UPLOAD_DIR, user_id)
    new_vault_dir = os.path.join(user_upload_dir, new_vault_id)
    os.makedirs(new_vault_dir, exist_ok=True)
    
    zip_path = os.path.join(new_vault_dir, "vault.zip")
    extract_to = os.path.join(new_vault_dir, "extracted")
    
    with open(zip_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # Process the new vault (this also deletes old qdrant points for the user in process_vault_zip)
        result = process_vault_zip(zip_path, extract_to, user_id, new_vault_id)
        
        # Save vault metadata to MongoDB
        await db.vaults.update_one(
            {"user_id": user_id},
            {"$set": {
                "vault_id": new_vault_id,
                "name": file.filename,
                "num_files": result["num_files"],
                "num_chunks": result["num_chunks"],
                "uploaded_at": datetime.utcnow().isoformat() + "Z"
            }},
            upsert=True
        )
        
        # Cleanup old vault directories for this user (keep only the new one)
        for d in os.listdir(user_upload_dir):
            if d != new_vault_id:
                old_dir = os.path.join(user_upload_dir, d)
                if os.path.isdir(old_dir):
                    shutil.rmtree(old_dir)
                    
        return {
            "status": "success",
            "num_files": result["num_files"],
            "num_chunks": result["num_chunks"]
        }
    except Exception as e:
        # If upload fails, cleanup the new directory so the old one remains
        shutil.rmtree(new_vault_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/notes")
async def list_notes(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    vault_meta = await db.vaults.find_one({"user_id": user_id})
    notes = []
    
    if not vault_meta:
        return notes
        
    vault_id = vault_meta["vault_id"]
    extract_to = os.path.join(BASE_UPLOAD_DIR, user_id, vault_id, "extracted")
    
    if not os.path.exists(extract_to):
        return notes
        
    for root, _, files in os.walk(extract_to):
        for file in files:
            if file.endswith(".md"):
                rel_path = os.path.relpath(os.path.join(root, file), extract_to)
                notes.append({
                    "title": file.replace(".md", ""),
                    "filename": rel_path.replace("\\", "/")
                })
    return notes

@router.get("/notes/{filename:path}")
async def get_note(filename: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    vault_meta = await db.vaults.find_one({"user_id": user_id})
    if not vault_meta:
        raise HTTPException(status_code=404, detail="No active vault found")
        
    vault_id = vault_meta["vault_id"]
    extract_to = os.path.join(BASE_UPLOAD_DIR, user_id, vault_id, "extracted")
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
