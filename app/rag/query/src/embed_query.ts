import { getEmbedder, initEmbedder } from "../../ingest/src/load_documents.ts";
import { querySimilarDocuments } from "../../store/src/vector_store.ts";

initEmbedder();

//embed prompt and retrieve similar documents
export async function retrieveContext(prompt: string) {
    const embedder = getEmbedder();
    const embedding = await embedder.getTextEmbedding(prompt);

    const rows = querySimilarDocuments(
        new Float32Array(embedding),
        5
    ) as { id: string, content: string }[];

    const seen = new Set<string>();
    const deduplicated: string[] = [];

    for (const r of rows) {
         const key = r.content.trim();
         if (seen.has(key)) continue;
         seen.add(key);
         deduplicated.push(key);
    }

    return deduplicated;
}