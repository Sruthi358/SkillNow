from livekit import api
import os
from dotenv import load_dotenv

load_dotenv()

token = (
    api.AccessToken(
        os.getenv("LIVEKIT_API_KEY"),
        os.getenv("LIVEKIT_API_SECRET"),
    )
    .with_identity("praharsha")
    .with_name("Praharsha")
    .with_grants(
        api.VideoGrants(
            room_join=True,
            room="skillnow-demo",
        )
    )
    .to_jwt()
)

print(token)