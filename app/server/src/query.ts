import { retrieveContext } from "../../rag/query/src/embed_query.ts";
import { llm } from "../../rag/agent/runtime.ts";

//run a query with context retrieval
export async function runQuery(userInput: string) {
    const chunks = await retrieveContext(userInput);

    const response = chunks.length > 0
            ? await llm.generateWithContext(
                  userInput,
                  chunks.join("\n---\n")
              )
            : await llm.generate(userInput);

    return {
        response,
        context_used: chunks.length,
    }
}