import os
import json
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from llm_runtime import LLMRuntime
from utils import log_interation

#load env variables
load_dotenv()
LOG_PATH = os.getenv("LOG_PATH")

app = FastAPI()

llm = LLMRuntime(
    os.getenv("MODEL_PATH"),
    os.getenv("SYSTEM_PROMPT_PATH"),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    text:str
    duration_ms: int | None = None

@app.post("/query")
async def query(q: Query):
    print(f"[STT] {q.duration_ms} ms | {q.text}")
    # response = llm.generate("Explain gravity like im five.")  # eval prompt
    response = llm.generate(q.text)

    log_interation({
        "input_text": q.text,
        "duration_ms": q.duration_ms,
        "response_text": response,
        "memory_turns": len(llm.history),
    })

    return {"response": response}
