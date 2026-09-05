import os
import shutil
import uuid
import tempfile
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pydantic import BaseModel
from app.services.vault_service import process_vault_zip
from app.services.database import db
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/vault", tags=["vault"])

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
    
    with tempfile.TemporaryDirectory() as temp_dir:
        zip_path = os.path.join(temp_dir, "vault.zip")
        extract_to = os.path.join(temp_dir, "extracted")
        
        with open(zip_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        try:
            # Process the new vault (this also deletes old qdrant points for the user)
            result = process_vault_zip(zip_path, extract_to, user_id, new_vault_id)
            
            file_docs = result.get("file_docs", [])
            
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
            
            # Replace old vault files with new ones in MongoDB
            await db.vault_files.delete_many({"user_id": user_id})
            if file_docs:
                await db.vault_files.insert_many(file_docs)
                
            return {
                "status": "success",
                "num_files": result["num_files"],
                "num_chunks": result["num_chunks"]
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@router.get("/notes")
async def list_notes(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    vault_meta = await db.vaults.find_one({"user_id": user_id})
    notes = []
    
    if not vault_meta:
        return notes
        
    vault_id = vault_meta["vault_id"]
    
    # Query MongoDB instead of traversing filesystem
    cursor = db.vault_files.find(
        {"user_id": user_id, "vault_id": vault_id},
        {"title": 1, "filename": 1, "_id": 0}
    )
    
    async for doc in cursor:
        notes.append({
            "title": doc["title"],
            "filename": doc["filename"]
        })
        
    return notes

@router.get("/notes/{filename:path}")
async def get_note(filename: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    vault_meta = await db.vaults.find_one({"user_id": user_id})
    if not vault_meta:
        raise HTTPException(status_code=404, detail="No active vault found")
        
    vault_id = vault_meta["vault_id"]
    
    # Query MongoDB for the file content
    file_doc = await db.vault_files.find_one({
        "user_id": user_id, 
        "vault_id": vault_id, 
        "filename": filename
    })
    
    if not file_doc:
        raise HTTPException(status_code=404, detail="Note not found")
        
    return {
        "title": file_doc["title"],
        "content": file_doc["content"]
    }
