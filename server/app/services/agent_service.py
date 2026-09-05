import json
import re
import google.generativeai as genai
from app.config import settings
from app.services.retrieval_service import search_vault_chunks

genai.configure(api_key=settings.GEMINI_API_KEY)

SYSTEM_PROMPT = """\
You are VaultMail, an AI email drafting assistant grounded in the user's Obsidian knowledge base.

The user will provide you with:
- Their email request
- Relevant excerpts retrieved from their vault

Your task:
1. Draft the email using ONLY the provided vault excerpts + the user's explicit request.
2. If specific details are missing from the excerpts, mark them as "[NOT FOUND IN VAULT — please fill in]".
3. Return ONLY a valid JSON object with exactly three keys:
   - "subject": the email subject line (string)
   - "body": the full email body as plain text (string)
   - "sources": list of objects, each with "title", "file", and "excerpt" keys

NEVER invent names, dates, numbers, or commitments not present in the provided excerpts.
Output ONLY the raw JSON object. No markdown, no explanation, no extra text.
"""

def _parse_json_response(text: str) -> dict:
    """Try to extract a JSON object from the model's text response."""
    text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    # Strip markdown fences if present
    match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass
    # Find any JSON object
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            pass
    # Fallback
    return {"subject": "Draft Email", "body": text, "sources": []}


async def generate_email_draft(prompt: str, to_email: str, user_id: str, vault_id: str) -> dict:
    """
    Two-step RAG pipeline (no Gemini function-calling):
      1. We run the semantic search ourselves.
      2. We inject the results as context into a single Gemini prompt.
    """
    # --- Step 1: Retrieve relevant chunks from Qdrant (local, fast) ---
    chunks = search_vault_chunks(prompt, user_id, vault_id, limit=5)

    if chunks:
        context_parts = []
        for i, chunk in enumerate(chunks, 1):
            context_parts.append(
                f"[Excerpt {i}]\n"
                f"Note: {chunk.get('note_title', 'Unknown')}\n"
                f"File: {chunk.get('source_file', '')}\n"
                f"---\n{chunk.get('text', '')}\n"
            )
        vault_context = "\n".join(context_parts)
    else:
        vault_context = "No relevant notes found in the vault."

    # --- Step 2: Ask Gemini to draft using the retrieved context ---
    full_prompt = f"User request: {prompt}"
    if to_email:
        full_prompt += f"\nRecipient email: {to_email}"
    full_prompt += f"\n\nVault excerpts:\n{vault_context}"

    # No tools=[] here — plain text generation, fast and reliable
    model = genai.GenerativeModel(
        model_name="gemini-3.6-flash",
        system_instruction=SYSTEM_PROMPT,
    )

    try:
        response = await model.generate_content_async(
            full_prompt,
            request_options={"timeout": 60.0}
        )

        result_dict = _parse_json_response(response.text)

        # Build sources from the retrieved chunks so we always have them
        sources = result_dict.get("sources", [])
        if not sources and chunks:
            sources = [
                {
                    "title": c.get("note_title", "Unknown"),
                    "file": c.get("source_file", ""),
                    "excerpt": c.get("text", "")[:200]
                }
                for c in chunks
            ]

        return {
            "draft": {
                "subject": result_dict.get("subject", "Draft Email"),
                "body": result_dict.get("body", ""),
                "to": to_email
            },
            "sources": sources
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
