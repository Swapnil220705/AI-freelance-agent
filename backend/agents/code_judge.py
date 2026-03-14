import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def llm_code_review(code_snippet):

    prompt = f"""
You are a senior software reviewer.

Evaluate this code.

Return score from 1 to 10 based on:
- code quality
- readability
- structure

Code:
{code_snippet}

Return JSON:
{{"score": number}}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.choices[0].message.content