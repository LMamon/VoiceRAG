# VoiceRAG

A voice-first RAG (Retrieval-Augmented Generation) application that lets you interact with your documents using speech instead of text. Press and hold the spacebar for push-to-talk (PTT) interaction with your AI agent.

## Features

- **Voice Input/Output** - Speak to your agent using spacebar PTT
- **Document Ingestion** - Load and index your documents into a vector store
- **RAG System** - Retrieve relevant documents and generate contextual responses
- **BYOM (Bring Your Own Model)** - Uses Ollama for flexible model selection
- **Local-First** - Run entirely on your machine with your choice of models

## Prerequisites

- Node.js (v16+)
- [Ollama](https://ollama.ai) installed and running
- A language model (e.g., `llama2`, `neural-chat`)
- An embedding model (e.g., `nomic-embed-text`, `all-minilm`)

## Setup

### 1. Install Dependencies

```bash
npm install
```
### 2. Configure Models

Download your desired models via ollama

```bash
ollama pull neural-chat      # Language model for generation
ollama pull nomic-embed-text # Embedding model for documents
```
### 3. Edit .env file

```bash
# Language model for generating responses
GENERATION_MODEL=neural-chat
# Embedding model for document and query embedding
EMBEDDING_MODEL=nomic-embed-text
```
### 4. Document Ingest

Place text documents in the /data folder then run:
```bash
node app/rag/ingest/src/run_ingest.ts
```
this will embed and store your docs in the vector db.

### 5. Start Application
```bash
npm run dev
```

Open your browser to address provided

### Usage
1. Click into the chat interface
2. Press and hold spacebar to start recording your voice prompt
3. Release spacebar to send your query
4. The agent will retrieve relevant documents and respond with audio + text
5. Repeat for multi-turn conversations

### Architecture
 - Frontend: TypeScript + Web Audio API for voice capture/playback
 - Backend: Node.js server handling RAG pipeline
 - Vector Store: Persistent storage for document embeddings
 - LLM: Ollama integration for both embedding and generation

### Feature Requests
Better browser UI

### License
Apache 2.0