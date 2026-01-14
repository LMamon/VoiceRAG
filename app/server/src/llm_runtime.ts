import ollama from 'ollama';
import fs from 'fs';

const MAX_TURNS = 6;

type ChatMessage = {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

type SystemConfig = {
    name: string;
    description: string;
    system_prompt: string;
}

export class LLMRuntime {
    private systemPrompt: string;
    private history: ChatMessage[] = [];
    private model: string;
    private agentName: string;

    constructor(model: string, systemPromptPath: string) {
        this.model = model;

        const config = JSON.parse(
            fs.readFileSync(systemPromptPath, 'utf-8')
        ) as SystemConfig;

        this.agentName = config.name;
        this.systemPrompt = config.system_prompt;
    }

    getMemoryTurns() {
        return this.history.length / 2;
    }

    getModel(): string {
        return this.model;
    }
    
    getAgent(): string {
        return this.agentName;
    }

    private buildMessages(userInput: string): ChatMessage[] {
        return [
            { role: "system", content: this.systemPrompt },
            ...this.history,
            { role: "user", content: userInput },
        ];
    }
        
    async generate(userInput: string): Promise<string> {
        const messages = this.buildMessages(userInput);

        const response = await ollama.chat({
            model: this.model,
            messages: messages,
            stream: false,
        });

        const reply = response.message.content.trim();

        this.history.push({ role: 'user', content: userInput });
        this.history.push({ role: 'assistant', content: reply });

        if (this.history.length / 2 > MAX_TURNS) {
            this.history.splice(0, 2);
        }

        return reply;
    }

    async generateWithContext(userInput: string, context: string): Promise<string> {
        const messages: ChatMessage[] = [
            { role: "system", content: this.systemPrompt },
            { 
                role: "user", 
                content:
                    "The following is retrieved reference material. " +
                    "Use it only if relevant. Do not invent information not present in it.\n\n" +
                    context,
            },
            ...this.history,
            { role: "user", content: userInput },
        ];
        
        const response = await ollama.chat({
            model: this.model,
            messages,
            stream: false,
        });

        const reply = response.message.content.trim();

        this.history.push({ role: 'user', content: userInput });
        this.history.push({ role: 'assistant', content: reply });
        
        while (this.history.length > MAX_TURNS * 2) {
            this.history.splice(0, 2);
        }
        return reply;
    }
}
