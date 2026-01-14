import "dotenv/config";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const VECTOR_DB_PATH = join(__dirname, "../store/vectors.db");

function requireEnv(value: string | undefined, name: string): string {
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

export const config = {
    embeddingModel: requireEnv(process.env.EMBEDDING_MODEL, "EMBEDDING_MODEL"),
    generationModel:requireEnv(process.env.GENERATION_MODEL, "GENERATION_MODEL"),
    logPath: requireEnv(process.env.LOG_PATH, "LOG_PATH"),
    systemPromptPath:requireEnv(process.env.SYSTEM_PROMPT_PATH, "SYSTEM_PROMPT_PATH"),
};

