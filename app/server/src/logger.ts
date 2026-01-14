import fs from 'fs';
import path from 'path';

const LOG_PATH = process.env.LOG_PATH ?? "app/rag/store";

const dir = path.dirname(LOG_PATH);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

type logEntry = {
    agent: string;
    input_text: string;
    response_text: string;
    duration_ms?: number;
    retrieved_chunks: number;
    memory_turns: number;
    timestamp: string;
    model: string;
}

export function logInteraction(entry: logEntry) {
    const record = {
        ...entry,
        timestamp: new Date().toISOString(),
    };

    fs.appendFile(
        LOG_PATH,
        JSON.stringify(record) + "\n",
        err => {
            if (err) {
                console.error("Failed to log entry:", err);
            }
        }
    );
}