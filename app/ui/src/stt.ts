type STThandlers = {
    onText: (text: string) => void;
    onError?: (error: unknown) => void;
}

export function createSTT({ onText, onError }: STThandlers) {
    let recognition : any | null = null;
    function build() {
        const SpeechRecognition =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
        if (!SpeechRecognition) {
            throw new Error("SpeechRecognition is not supported in this browser.");
        }

        const r = new SpeechRecognition();
        r.lang = "en-US";
        r.interimResults = false;
        r.continuous = false;
        r.maxAlternatives = 1;

        r.onresult = (e: any) => {
            for (let i = e.resultIndex; i < e.results.length; i++) {
                const result = e.results[i];
                if (!result.isFinal) continue;

                const transcript = result[0].transcript.trim();
                if (transcript) onText(transcript);
            }
        };

        r.onerror = (e: any) => onError?.(e.error ?? e);
        return r;
    }

    return {
        start: () => {
            recognition = build()
            recognition.start()
        },
        stop: () => {
            recognition?.stop()
            recognition = null;
            }
    };
}