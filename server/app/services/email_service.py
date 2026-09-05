import smtplib
import uuid
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.config import settings
from app.services.database import db

async def send_email(to: str, subject: str, body_html: str, user_id: str):
    if not to or not to.strip():
        raise ValueError("Recipient address cannot be empty")
    if not settings.GMAIL_ADDRESS or not settings.GMAIL_APP_PASSWORD or settings.GMAIL_ADDRESS == "your_email@gmail.com":
        raise ValueError("Gmail credentials not properly configured in .env file")
        
    msg = MIMEMultipart("alternative")
    msg["From"] = f"VaultMail <{settings.GMAIL_ADDRESS}>"
    msg["To"] = to
    msg["Subject"] = subject
    msg.attach(MIMEText(body_html, "html"))
    
    # Try sending via Gmail SMTP
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(settings.GMAIL_ADDRESS, settings.GMAIL_APP_PASSWORD)
        server.send_message(msg)
        
    message_id = str(uuid.uuid4())
    await _save_to_history(to, subject, message_id, user_id)
    return message_id

async def _save_to_history(to: str, subject: str, message_id: str, user_id: str):
    log_doc = {
        "user_id": user_id,
        "message_id": message_id,
        "to": to,
        "subject": subject,
        "sent_at": datetime.utcnow().isoformat() + "Z"
    }
    await db.email_logs.insert_one(log_doc)

async def get_email_history(user_id: str):
    cursor = db.email_logs.find({"user_id": user_id})
    # sort by sent_at descending
    history = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])  # convert ObjectId to string for JSON serialization
        history.append(doc)
    return history
