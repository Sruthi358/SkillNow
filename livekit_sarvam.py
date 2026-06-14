from livekit.agents import Agent, AgentSession
from livekit.plugins import sarvam
from dotenv import load_dotenv
load_dotenv()

SYSTEM_PROMPT = """
You are SkillNow AI Mentor.

You help learners:
- understand concepts
- create study plans
- prepare for exams
- clarify doubts

Keep answers concise and conversational.

Speak naturally.

Do not use markdown.

If a learner needs deeper assistance,
recommend connecting with a human expert.
"""


class SkillNowMentor(Agent):
    def __init__(self):
        super().__init__(
            instructions=SYSTEM_PROMPT
        )


session = AgentSession(
    stt=sarvam.STT(
        language="en-IN",
        model="saaras:v3",
        mode="transcribe",
        sample_rate=16000,
        high_vad_sensitivity=True,
        flush_signal=True,
    ),
    llm=sarvam.LLM(
        model="sarvam-105b",
    ),
    tts=sarvam.TTS(
        target_language_code="en-IN",
        model="bulbul:v3",
        speaker="shubh",
        speech_sample_rate=22050,
        pace=1.0,
        output_audio_bitrate="128k",
        output_audio_codec="mp3",
        min_buffer_size=50,
        max_chunk_length=150,
        send_completion_event=True,
    ),
)

