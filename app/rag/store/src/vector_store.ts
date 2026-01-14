import { DatabaseSync } from "node:sqlite";
import * as sqliteVec from "sqlite-vec";
import { VECTOR_DB_PATH } from "../../src/utils.ts";

const dbPath = VECTOR_DB_PATH;

const db = new DatabaseSync(dbPath, { allowExtension: true });
sqliteVec.load(db);

db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        embedding BLOB NOT NULL
    );
`);

const count = db.prepare("SELECT COUNT(*) as c FROM documents").get();
console.log("VECTOR DB ROW COUNT:", count);

export function insertDocument(
    id: string,
    content: string,
    embedding: Float32Array,
) {
    const vec = embedding;
    db.prepare(`
        INSERT OR REPLACE INTO documents (id, content, embedding)
        VALUES (?, ?, ?)
        `).run(id, content, new Uint8Array(vec.buffer));
}

export function querySimilarDocuments(embedding: Float32Array, limit: number,
        maxDistance = 0.35
 ) {
    const vec = embedding;

    return db.prepare(`
        SELECT
            id,
            content,
            vec_distance_cosine(embedding, CAST(? AS BLOB)) AS distance
            FROM documents
            ORDER BY distance ASC
            LIMIT ?
    `).all(
        new Uint8Array(vec.buffer),
        limit
);
}