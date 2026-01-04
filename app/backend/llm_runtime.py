import json
from llama_cpp import Llama

MAX_TURNS = 6

class LLMRuntime:
    """
    Encapsulates all LLM-related concerns:
    - Model loading
    - System prompt management
    - Conversation history
    - Prompt construction
    - Text generation

    This class is intentionally stateless across sessions for now
    (single rolling conversation).
    """
    def __init__(self, model_path, system_prompt_path):
        """
        Initialize the LLM runtime.

        Loads:
        - System prompt from JSON (for easy swapping/versioning)
        - Local GGUF model via llama.cpp

        Initializes:
        - In-memory rolling conversation history
        """
        with open(system_prompt_path, "r") as f:
            self.system_prompt = json.load(f)["system_prompt"]

        self.model = Llama(
            model_path=model_path,
            n_ctx=4096,
        )

        self.history = []

    def build_prompt(self, user_text):
        """
        Builds the full prompt sent to the model.

        Structure:
        - System prompt (instructions / persona)
        - Prior conversation turns (rolling memory)
        - Current user input

        NOTE:
        This currently uses turn-based trimming.
        Token-based trimming may replace this for long voice inputs.
        """
        parts = [f"<|system|>\n{self.system_prompt}"]
        
        for turn in self.history:
            parts.append(f"<|user|>\n{turn['user']}")
            parts.append(f"<|assistant|>\n{turn['assistant']}")

        parts.append(f"<|user|>\n{user_text}")
        parts.append(f"<|assistant|>")

        return "\n".join(parts)

    def generate(self, user_text):
        """
        Generates a model response for the given user input.

        Steps:
        1. Build full prompt including history
        2. Run inference via llama.cpp
        3. Extract assistant response
        4. Append to rolling history
        5. Trim history to MAX_TURNS

        Returns:
        - Assistant text only (no metadata)
        """
        prompt = self.build_prompt(user_text)

        out = self.model(
            prompt,
            max_tokens=256,
            stop=["<|user|>", "<|system|>", "<|assistant|>"],
        )

        reply = out["choices"][0]["text"]
        reply = reply.split("<|")[0].strip()

        self.history.append({
            "user": user_text,
            "assistant": reply,
        })

        self.history = self.history[-MAX_TURNS:]

        return reply
