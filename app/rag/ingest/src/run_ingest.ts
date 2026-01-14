import { getEmbedder, initEmbedder, loadDocuments } from "./load_documents.ts";
import { insertDocument } from "../../store/src/vector_store.ts";
import { SentenceSplitter } from "@llamaindex/core/node-parser";

//set embedding model
initEmbedder();
const embedder = getEmbedder();

//load documents from data directory
const documents = await loadDocuments();
console.log(`Loaded ${documents.length} document(s).`);

//chunk into nodes
const spliter = new SentenceSplitter({
    chunkSize: 512,
    chunkOverlap: 50,
});

const nodes = spliter.getNodesFromDocuments(documents);

//embed and store each node
let count = 0;
for (const node of nodes) {
    const text = node.getText();
    const embedding = await embedder.getTextEmbedding(text);

    insertDocument(
        node.id_,
        node.getText(),
        new Float32Array(embedding)
    );
    count++;
}

console.log(`Ingestion complete. Inserted ${count} chunks.`);