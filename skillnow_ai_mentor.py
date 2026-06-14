import os

from dotenv import load_dotenv
from loguru import logger

from pipecat.audio.vad.silero import SileroVADAnalyzer
from pipecat.frames.frames import LLMRunFrame
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.worker import PipelineParams, PipelineWorker
from pipecat.processors.aggregators.llm_context import LLMContext
from pipecat.processors.aggregators.llm_response_universal import (
    LLMContextAggregatorPair,
    LLMUserAggregatorParams,
)
from pipecat.runner.types import RunnerArguments
from pipecat.runner.utils import create_transport

from pipecat.services.sarvam.llm import SarvamLLMService
from pipecat.services.sarvam.stt import SarvamSTTService
from pipecat.services.sarvam.tts import SarvamTTSService

from pipecat.transports.base_transport import BaseTransport, TransportParams
from pipecat.transports.daily.transport import DailyParams
from pipecat.transports.websocket.fastapi import FastAPIWebsocketParams
from pipecat.transports.websocket.server import WebsocketServerParams

from pipecat.workers.runner import WorkerRunner

load_dotenv(override=True)


# ==========================================================
# Replace this later with your actual SkillNow JSON summary
# ==========================================================

STUDENT_CONTEXT = """
{
    "title": "GATE CSE Preparation",
    "userGoal": "Prepare for GATE 2027",
    "userChallenge": "Unsure where to start",
    "summary": "Beginner preparing for GATE CSE",
    "focusAreas": [
        "DSA",
        "Operating Systems",
        "DBMS",
        "Computer Networks"
    ]
}
"""


SYSTEM_PROMPT = f"""
You are SkillNow AI Mentor.

You are speaking to a learner.

Student Profile:

{STUDENT_CONTEXT}

Responsibilities:

- Answer questions.
- Guide the learner.
- Create study plans.
- Explain concepts.
- Ask follow-up questions.
- Be conversational.
- Keep answers short.
- Speak naturally.

Never use markdown.

Never use bullet points.

Never say you are an AI model.

If the user needs advanced help,
recommend connecting with a human expert.
"""


transport_params = {
    "eval": lambda: WebsocketServerParams(
        audio_in_enabled=True,
        audio_out_enabled=True,
    ),
    "daily": lambda: DailyParams(
        audio_in_enabled=True,
        audio_out_enabled=True,
    ),
    "twilio": lambda: FastAPIWebsocketParams(
        audio_in_enabled=True,
        audio_out_enabled=True,
    ),
    "webrtc": lambda: TransportParams(
        audio_in_enabled=True,
        audio_out_enabled=True,
    ),
}


async def run_bot(transport: BaseTransport, runner_args: RunnerArguments):
    logger.info("Starting SkillNow AI Mentor")

    stt = SarvamSTTService(
        api_key=os.environ["SARVAM_API_KEY"],
        settings=SarvamSTTService.Settings(
            model="saaras:v3",
        ),
    )

    llm = SarvamLLMService(
        api_key=os.environ["SARVAM_API_KEY"],
        settings=SarvamLLMService.Settings(
            system_instruction=SYSTEM_PROMPT,
        ),
    )

    tts = SarvamTTSService(
        api_key=os.environ["SARVAM_API_KEY"],
        settings=SarvamTTSService.Settings(
            model="bulbul:v3",
            voice="shubh",
        ),
    )

    context = LLMContext()

    user_aggregator, assistant_aggregator = (
        LLMContextAggregatorPair(
            context,
            user_params=LLMUserAggregatorParams(
                vad_analyzer=SileroVADAnalyzer()
            ),
        )
    )

    pipeline = Pipeline(
        [
            transport.input(),
            stt,
            user_aggregator,
            llm,
            tts,
            transport.output(),
            assistant_aggregator,
        ]
    )

    worker = PipelineWorker(
        pipeline,
        params=PipelineParams(
            enable_metrics=True,
            enable_usage_metrics=True,
        ),
    )

    @transport.event_handler("on_client_connected")
    async def on_client_connected(transport, client):
        logger.info("Client connected")

        context.add_message(
            {
                "role": "developer",
                "content": """
Introduce yourself as SkillNow AI Mentor.

Greet the learner.

Briefly explain that you can help
with study plans, doubts, and learning guidance.
""",
            }
        )

        await worker.queue_frames([LLMRunFrame()])

    @transport.event_handler("on_client_disconnected")
    async def on_client_disconnected(transport, client):
        logger.info("Client disconnected")
        await worker.cancel()

    runner = WorkerRunner(
        handle_sigint=runner_args.handle_sigint
    )

    await runner.add_workers(worker)
    await runner.run()


async def bot(runner_args: RunnerArguments):
    transport = await create_transport(
        runner_args,
        transport_params
    )

    await run_bot(transport, runner_args)


if __name__ == "__main__":
    from pipecat.runner.run import main

    main()