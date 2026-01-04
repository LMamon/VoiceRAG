import os
import json
from datetime import datetime


def log_interation(payload: dict):
    """
    Docstring for log_interation
    
    :param payload: Description
    :type payload: dict
    
    Append a single interaction as JSONL
    """
    LOG_PATH = os.getenv("LOG_PATH")
    if not LOG_PATH:
        return RuntimeError("LOG_PATH is not set")
    
    payload["timestamp"] = datetime.now().isoformat()

    with open(LOG_PATH, "a") as f:
        f.write(json.dumps(payload, ensure_ascii=False) + "\n")