import { Settings } from "llamaindex";
import { SimpleDirectoryReader } from "@llamaindex/readers/directory";
import { OllamaEmbedding } from "@llamaindex/ollama";
import { config } from "../../src/utils.ts";

let embedderInitialized = false;
//set embedding model
export function initEmbedder() {
    if (embedderInitialized) return; // already initialized
    
    const model = config.embeddingModel;
    if (!model) {
        throw new Error("EMBEDDING_MODEL environment variable is not set.");
    }
    Settings.embedModel = new OllamaEmbedding({ model });
}

export function getEmbedder() {
    if (!Settings.embedModel) {
        throw new Error("Embedder not initialized. Call initEmbedder() first.");
    }
    return Settings.embedModel;
}

//load documents
export async function loadDocuments() {
    const dir = "./data";
    const reader = new SimpleDirectoryReader();
    return reader.loadData(dir);
}