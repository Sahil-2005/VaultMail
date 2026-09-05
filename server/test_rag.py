import requests
import json
import zipfile
import os

BASE_URL = "http://127.0.0.1:8000/api"
TEST_USER = {"name": "Test User", "email": "ragtest@example.com", "password": "password123"}

def run_test():
    # 1. Register/Login
    print("Registering...")
    res = requests.post(f"{BASE_URL}/auth/register", json=TEST_USER)
    if res.status_code == 400:
        print("Already registered, logging in...")
        res = requests.post(f"{BASE_URL}/auth/login", data={"username": TEST_USER["email"], "password": TEST_USER["password"]})
    
    token = res.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    print(f"Got token: {token[:10]}...")

    # 2. Create a dummy vault zip
    print("Creating dummy vault...")
    os.makedirs("dummy_vault", exist_ok=True)
    with open("dummy_vault/test_note.md", "w") as f:
        f.write("# Gemini API Secrets\nThe secret to using Gemini API is to configure it properly and send the correct model name.")
    
    with zipfile.ZipFile("test_vault.zip", "w") as z:
        z.write("dummy_vault/test_note.md", arcname="test_note.md")

    # 3. Upload vault
    print("Uploading vault...")
    with open("test_vault.zip", "rb") as f:
        res = requests.post(f"{BASE_URL}/vault/upload", headers=headers, files={"file": f})
    print(f"Upload response: {res.json()}")

    # 4. Draft Email
    print("Drafting email...")
    draft_req = {
        "recipient": "boss@example.com",
        "sender": "ragtest@example.com",
        "context": "Write an email explaining the secret to using Gemini API.",
        "tone": "professional"
    }
    res = requests.post(f"{BASE_URL}/draft-email", headers=headers, json=draft_req)
    print(f"Draft response status: {res.status_code}")
    print(f"Draft content:\n{res.json().get('draft', '')}")
    print(f"Sources used: {res.json().get('sources', [])}")

if __name__ == "__main__":
    run_test()
