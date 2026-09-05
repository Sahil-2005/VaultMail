from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

if settings.MONGODB_URI:
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client.get_default_database("vaultmail")
else:
    # Fallback to local if URI not provided for testing
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.vaultmail
