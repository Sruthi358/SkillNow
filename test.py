import requests
import json

API_KEY = ""

url = "https://api.sarvam.ai/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

messages = [
    {
        "role": "system",
        "content": """
You are SkillNow AI.

Your job is to help users learn skills.

For every skill:
1. Determine current level.
2. Suggest roadmap.
3. Suggest resources.
4. Suggest projects.
5. Estimate learning time.

Always be concise and practical.
"""
    }
]
print("🤖 SkillNow Chatbot (type 'exit' to quit)\n")

while True:
    user_input = input("You: ")

    if user_input.lower() == "exit":
        break

    messages.append({
        "role": "user",
        "content": user_input
    })

    payload = {
        # "model": "sarvam-30b",
        "model": "sarvam-105b",
        "messages": messages,
        "temperature": 0.7
    }

    response = requests.post(
        url,
        headers=headers,
        json=payload
    )

    # result = response.json()

    # assistant_reply = result["choices"][0]["message"]["content"]
    result = response.json()

    print("\nDEBUG RESPONSE:")
    print(json.dumps(result, indent=2))

    if "choices" not in result:
        print("\nAPI Error:", result)
        continue

    assistant_reply = result["choices"][0]["message"]["content"]

    print(f"\nBot: {assistant_reply}\n")

    messages.append({
        "role": "assistant",
        "content": assistant_reply
    })