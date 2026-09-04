import json
import google.generativeai as genai
from app.config import settings
from app.services.retrieval_service import search_vault_chunks

genai.configure(api_key=settings.GEMINI_API_KEY)

def search_vault(query: str, max_results: int = 5) -> dict:
    """
    Search the user's Obsidian vault for relevant notes. Use this to find information before drafting emails.
    Always search before making claims about the user's projects, plans, or data.
    
    Args:
        query: Semantic search query to find relevant notes
        max_results: Number of results to return (default 5, max 10)
    """
    results = search_vault_chunks(query, limit=max_results)
    return {"results": results}

SYSTEM_PROMPT = """
You are VaultMail, an AI email drafting assistant. You have access to the user's Obsidian knowledge base through a search tool.

When the user asks you to draft an email:
1. ALWAYS search the vault first to find relevant information. 
2. Draft the email using ONLY information found in the vault + the user's explicit request.
3. If the vault doesn't contain relevant information, say so clearly — do NOT make up facts. Mark missing information as "[NOT FOUND IN VAULT — please fill in]".
4. Output the final result as a JSON object with three keys:
   - "subject": The subject line of the email
   - "body": The HTML formatted body of the email
   - "sources": A list of sources used, where each source is an object with "title" (the note_title), "file" (the source_file path), and "excerpt" (a short relevant snippet).

NEVER invent personal details, dates, numbers, or commitments not found in the vault.
"""

def generate_email_draft(prompt: str, to_email: str = "") -> dict:
    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        tools=[search_vault],
        system_instruction=SYSTEM_PROMPT,
        generation_config={"response_mime_type": "application/json"}
    )
    
    # We use enable_automatic_function_calling so Gemini handles the loop
    chat = model.start_chat(enable_automatic_function_calling=True)
    
    # Optional enhancement: Force retrieval by manually querying if we want strict control,
    # but Gemini handles automatic tool calling well when instructed to ALWAYS search.
    
    full_prompt = f"Draft an email based on this request: {prompt}"
    if to_email:
        full_prompt += f"\nRecipient: {to_email}"
        
    try:
        response = chat.send_message(full_prompt)
        
        # Parse the JSON response
        result_dict = json.loads(response.text)
        
        # Format to match our API spec exactly
        return {
            "draft": {
                "subject": result_dict.get("subject", "Draft Email"),
                "body": result_dict.get("body", ""),
                "to": to_email
            },
            "sources": result_dict.get("sources", [])
        }
    except Exception as e:
        print(f"Agent error: {e}")
        return {
            "draft": {
                "subject": "Error generating draft",
                "body": f"<p>Error: {str(e)}</p>",
                "to": to_email
            },
            "sources": []
        }
