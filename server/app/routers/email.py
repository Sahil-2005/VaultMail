from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.services.email_service import send_email, get_email_history
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/emails", tags=["emails"])

class SendEmailRequest(BaseModel):
    to: str
    subject: str
    body_html: str

@router.post("/send")
async def send_approved_email(req: SendEmailRequest, current_user: dict = Depends(get_current_user)):
    try:
        message_id = await send_email(req.to, req.subject, req.body_html, current_user["id"])
        return {"success": True, "message_id": message_id}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

@router.get("/history")
async def email_history(current_user: dict = Depends(get_current_user)):
    return await get_email_history(current_user["id"])

