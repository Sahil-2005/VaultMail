from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.agent_service import generate_email_draft

router = APIRouter(prefix="/api", tags=["agent"])

class DraftRequest(BaseModel):
    prompt: str
    to_email: Optional[str] = ""

@router.post("/draft-email")
async def draft_email(req: DraftRequest):
    return generate_email_draft(req.prompt, req.to_email)
