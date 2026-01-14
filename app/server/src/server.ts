import Fastify from "fastify";
import staticPlugin from "@fastify/static";
import { runQuery } from "./query.ts";
import { llm } from "../../rag/agent/runtime.ts";
import { logInteraction } from "./logger.ts";
import cors from "@fastify/cors";

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = Fastify(
    { logger: true }
);

await app.register(cors, {
    origin: true,
    methods: ["GET", "POST", "OPTIONS"],
})

app.register(staticPlugin, {
    root: join(__dirname, "../../ui"),
    prefix: "/", 
});

app.post("/query", async (request) => {
    const { text, duration_ms } = request.body as {
        text: string;
        duration_ms?: number;
    };

    const { response, context_used } = await runQuery(text);
    
    console.log("Retrieved context:\n", context_used);
    logInteraction({
        agent: llm.getAgent(),
        input_text: text,
        response_text: response,
        duration_ms,
        retrieved_chunks: context_used, //chunks.length,
        memory_turns: llm.getMemoryTurns(),
        timestamp: new Date().toISOString(),
        model: llm.getModel(),
    });

    return { response };
    });

    await app.listen({ port: 8000});