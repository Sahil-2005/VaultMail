from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.agent_service import generate_email_draft
from app.services.database import db
from app.dependencies import get_current_user

router = APIRouter(prefix="/api", tags=["agent"])

class DraftRequest(BaseModel):
    prompt: str
    to_email: Optional[str] = ""

@router.post("/draft-email")
async def draft_email(req: DraftRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    vault_meta = await db.vaults.find_one({"user_id": user_id})
    if not vault_meta:
        raise HTTPException(status_code=400, detail="No active vault found. Please upload a vault first.")
        
    vault_id = vault_meta["vault_id"]
    return await generate_email_draft(req.prompt, req.to_email, user_id, vault_id)
