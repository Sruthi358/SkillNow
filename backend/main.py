from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from firebase_db import db

import os
import json
import requests

from dotenv import load_dotenv

load_dotenv()

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class ScanRequest(BaseModel):
    url: str
    title: str
    content: str


@app.post("/scan")
async def scan(data: ScanRequest):

    print("\n====================================")
    print("SCAN REQUEST RECEIVED")
    print("URL:", data.url)
    print("TITLE:", data.title)
    print("CONTENT LENGTH:", len(data.content))
    print("====================================")

    system_prompt = """You are SkillNow AI.

Your job is NOT to summarize webpages.

Your job is to understand:

1. What the user is trying to achieve.
2. What challenge or problem they are facing.
3. Whether they need expert assistance.
4. What information an expert should receive.
5. What technologies, tools, or domains are involved.
6. Whether there are alternative solutions the user can try before consulting an expert.

Ignore:
- Navigation menus
- Sidebars
- Headers
- Footers
- Advertisements
- Repeated content

Generate a SkillNow Ticket.

Return ONLY valid JSON.

Schema:

{
  "ticketId": "",

  "title": "",

  "expertCategory": "",

  "priority": "",

  "status": "pending",

  "userGoal": "",

  "userChallenge": "",

  "summary": "",

  "technologiesAndTools": [],

  "informationForExpert": {
    "topic": "",
    "specificNeeds": [],
    "userContext": ""
  },

  "possibleRootCause": "",

  "recommendedExpertLevel": "",

  "createdAt": "2026-06-12",

  "expertMatched": false

  Generate 3-5 practical alternative solutions.

The alternatives should:

- Be realistic
- Be actionable
- Help the user solve the issue without expert help
- Be ordered from easiest to hardest

If no meaningful alternatives exist,
return an empty array.

Example:

"alternativeSolutions": [
  {
    "title": "Use Built-in Power BI Visuals",
    "description": "Try using built-in charts before moving to custom visuals.",
    "difficulty": "Easy",
    "estimatedSuccessRate": "High"
  }
]
}"""

    payload = {
        "model": "sarvam-105b",
        "messages": [
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": f"""
URL:
{data.url}

PAGE TITLE:
{data.title}

PAGE CONTENT:
{data.content[:12000]}
"""
            }
        ],
        "temperature": 0.1
    }

    try:

        response = requests.post(
            "https://api.sarvam.ai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {SARVAM_API_KEY}",
                "Content-Type": "application/json"
            },
            json=payload,
            timeout=60
        )

        result = response.json()

        print("\n====================================")
        print("SARVAM RAW RESPONSE")
        print("====================================")
        print(result)

        llm_response = result["choices"][0]["message"]["content"]

        print("\n====================================")
        print("RAW LLM OUTPUT")
        print("====================================")
        print(llm_response)

        cleaned_response = llm_response.strip()

        cleaned_response = cleaned_response.replace(
            "```json",
            ""
        )

        cleaned_response = cleaned_response.replace(
            "```",
            ""
        )

        cleaned_response = cleaned_response.strip()

        print("\n====================================")
        print("CLEANED RESPONSE")
        print("====================================")
        print(cleaned_response)

        # ticket = json.loads(cleaned_response)

        # print("\n====================================")
        # print("FINAL JSON")
        # print("====================================")
        # print(ticket)

        # return ticket

        ticket = json.loads(cleaned_response)
        if "alternativeSolutions" not in ticket:
            ticket["alternativeSolutions"] = []

        print("\n====================================")
        print("FINAL JSON")
        print("====================================")
        print(ticket)

        # Save to Firestore
        doc_ref = db.collection("tickets").document()

        ticket["ticketId"] = doc_ref.id

        doc_ref.set(ticket)

        print("TICKET SAVED TO FIRESTORE")

        return ticket

    except Exception as e:

        print("\n====================================")
        print("ERROR OCCURRED")
        print("====================================")
        print(e)

        return {
        "title": data.title,
        "expertCategory": "General",
        "priority": "Medium",
        "status": "pending",

        "userIntent": "",

        "problemStatement": "",

        "summary": "Could not generate structured summary.",

        "techStack": [],

        "previousAttempts": [],

        "possibleRootCause": "",
        "alternativeSolutions": [
        {
        "title": "",
        "description": "",
        "difficulty": "",
        "estimatedSuccessRate": ""
        }
    ],

        "recommendedExpertLevel": "",

        "createdAt": "2026-06-12",

        "expertMatched": False
    }