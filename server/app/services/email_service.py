import os
import json
import uuid
import smtplib
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.config import settings

HISTORY_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "email_history.json")

def send_email(to: str, subject: str, body_html: str):
    if not settings.GMAIL_ADDRESS or not settings.GMAIL_APP_PASSWORD:
        raise ValueError("Gmail credentials not configured")
        
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
    _save_to_history(to, subject, message_id)
    return message_id

def _save_to_history(to: str, subject: str, message_id: str):
    history = []
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r") as f:
                history = json.load(f)
        except json.JSONDecodeError:
            pass
            
    history.append({
        "message_id": message_id,
        "to": to,
        "subject": subject,
        "sent_at": datetime.now().isoformat()
    })
    
    os.makedirs(os.path.dirname(HISTORY_FILE), exist_ok=True)
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=2)

def get_email_history():
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r") as f:
                return json.load(f)
        except json.JSONDecodeError:
            pass
    return []
