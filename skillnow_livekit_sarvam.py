import os
from dotenv import load_dotenv

from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    WorkerOptions,
    cli,
)

from livekit.plugins import sarvam

load_dotenv()


class SkillNowMentor(Agent):
    def __init__(self):
        super().__init__(
            instructions="""
You are SkillNow AI Mentor.

You help learners understand concepts,
prepare for exams,
create study plans,
and solve doubts.

Keep responses conversational and concise.

If a learner requires deeper guidance,
recommend connecting with a human expert.
"""
        )

ticket_context = """
{'ticketId': 'SKN-2026-06-12-001', 'title': 'Personalized GATE CSE Preparation Plan', 'expertCategory': 'Education & Test Preparation', 'priority': 'medium', 'status': 'pending', 'userGoal': 'To create a structured, personalized study plan for the GATE CSE exam in November, leveraging their existing background in programming and DSA to achieve a target rank.', 'userChallenge': 'The user has a strong foundation in CSE topics but needs a structured, time-bound study plan to prepare effectively for the GATE exam. They are looking for a roadmap that prioritizes subjects, allocates study time, and incorporates practice strategies like PYQs and mock tests.', 'summary': 'A CSE student with experience in Python, Java, and DSA needs a personalized study plan for the upcoming GATE CSE exam. The user is in their final year and aims for a top 500 rank. They require a structured schedule that balances college commitments with dedicated study time, focusing on high-weightage subjects and a strategic revision plan.', 'technologiesAndTools': ['GATE CSE Syllabus', 'Previous Year Questions (PYQs)', 'Mock Test Platforms', 'Standard Textbooks (CLRS, Galvin, Korth, etc.)'], 'informationForExpert': {'topic': 'GATE CSE Exam Preparation Strategy', 'specificNeeds': ['A month-by-month study schedule from now until the exam.', 'Weekly targets for each subject.', 'A strategy for integrating PYQs and mock tests.', 'Prioritization of high-weightage topics.', "A plan that accommodates a final-year college student's schedule."], 'userContext': 'The user is a final-year CSE student with a strong background in programming, data structures, and algorithms. They are targeting a rank in the top 500 for the November GATE exam and can dedicate 3-4 hours on weekdays and 6-8 hours on weekends.'}, 'possibleRootCause': "The user's challenge is not a lack of knowledge but a lack of a structured, actionable plan to channel their existing knowledge effectively for the specific format and requirements of the GATE exam.", 'recommendedExpertLevel': 'Intermediate', 'createdAt': '2026-06-12', 'expertMatched': False, 'alternativeSolutions': [{'title': 'Follow a Standard GATE CSE Study Schedule', 'description': 'Use a pre-made, comprehensive study plan available online (e.g., from coaching institutes or educational websites) that covers all subjects in a logical order.', 'difficulty': 'Easy', 'estimatedSuccessRate': 'Medium'}, {'title': 'Focus on High-Weightage Subjects First', 'description': 'Dedicate the majority of study time to Algorithms, Programming & Data Structures, Operating Systems, and Computer Networks, as these typically contribute the most marks.', 'difficulty': 'Easy', 'estimatedSuccessRate': 'High'}, {'title': 'Create a Weekly Topic-Wise Plan', 'description': 'Break down the syllabus into weekly topics for each subject and create a checklist. This provides a clear, manageable daily goal without needing a full month-by-month roadmap.', 'difficulty': 'Medium', 'estimatedSuccessRate': 'High'}, {'title': 'Prioritize Solving Previous Year Questions (PYQs)', 'description': 'Instead of focusing heavily on theory, start solving PYQs topic-wise from 2015-2026. This helps identify important topics and improves exam-specific problem-solving skills.', 'difficulty': 'Medium', 'estimatedSuccessRate': 'High'}]}"""


async def entrypoint(ctx: JobContext):
    print("Connecting to room...")

    await ctx.connect()

    print("Connected to room.")

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
        ),
    )

    print("Waiting for participant...")

    await session.start(
        room=ctx.room,
        agent=SkillNowMentor(),
    )


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            agent_name="skillnow-mentor",
            ws_url=os.getenv("LIVEKIT_URL"),
            api_key=os.getenv("LIVEKIT_API_KEY"),
            api_secret=os.getenv("LIVEKIT_API_SECRET"),
        )
    )