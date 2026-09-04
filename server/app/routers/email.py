from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.email_service import send_email, get_email_history

router = APIRouter(prefix="/api/emails", tags=["emails"])

class SendEmailRequest(BaseModel):
    to: str
    subject: str
    body_html: str

@router.post("/send")
async def send_approved_email(req: SendEmailRequest):
    try:
        message_id = send_email(req.to, req.subject, req.body_html)
        return {"success": True, "message_id": message_id}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

@router.get("/history")
async def email_history():
    return get_email_history()
