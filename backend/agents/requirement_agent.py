import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_milestones(description):

    prompt = f"""
Break this project into milestones.

Project:
{description}

Return ONLY valid JSON in this format:

{{
 "milestones":[
   {{
     "title":"Milestone title",
     "description":"Milestone description",
     "payout_percentage":30
   }}
 ]
}}

DO NOT include markdown or explanations.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    text = response.text

    print("Gemini raw response:", text)  # DEBUG

    # Clean markdown if present
    text = text.replace("```json", "").replace("```", "").strip()

    try:
        result = json.loads(text)
        return result
    except Exception as e:
        print("JSON ERROR:", e)
        return {"milestones": []}