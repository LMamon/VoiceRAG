import { LLMRuntime } from "../../server/src/llm_runtime.ts";
import { config } from "../src/utils.ts";

export const llm = new LLMRuntime(
    config.generationModel,
    config.systemPromptPath,
);