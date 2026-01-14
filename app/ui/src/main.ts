import { createSTT } from "./stt.js";
import { playTTS } from "./tts.js";

let isRecording: boolean = false;
let startTime: number | null = null;
let lastDurationMs: number | null = null;

const enableMicBtn = document.getElementById("enableMicBtn");
let micReady = false;
const recordBtn = document.getElementById("recordBtn");
const status = document.createElement("div");
const output = document.createElement("pre");

document.body.appendChild(status);
document.body.appendChild(output);

//// TODO: token based trimming is going to get replaced when transcripts get too long

enableMicBtn?.addEventListener("click", async () => {
    try {
        await enableMicOnce();
        status.textContent = "Microphone enabled.";
        enableMicBtn.style.display = "none";
    } catch (err) {
        status.textContent = "Mic permission denied";
        console.error(err);
    }
})

async function enableMicOnce() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(t => t.stop());
    micReady = true;
}

const stt = createSTT({
    onText: async (text: string) => {
        stt.stop();
        console.log("final:", text);

        status.textContent = "Thinking...";
        
        const res = await fetch("http://localhost:8000/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                text,
                duration_ms: lastDurationMs,
            }),
        });

        if (!res.ok) {
            throw new Error(`Server error: ${res.status}`);
        }
        
        const { response } = await res.json();
        status.textContent = "Speaking...";
        await playTTS(response);
        
        output.textContent = "Model: " + response;
        status.textContent = "Done";
    },
    onError: (err: unknown) => console.error("speech error:", err),
});

function startRecording(): void {
    if (isRecording) return;
    isRecording = true;
    startTime = performance.now();
    status.textContent = "Recording...";
    stt.start();
}

function stopRecording(): void {
    if (!isRecording) return;
    isRecording = false;

    if (startTime === null) return;
    const elapsed = performance.now() - startTime;
    lastDurationMs = Math.floor(elapsed);
    startTime = null;

    const ms = Math.floor(elapsed % 1000);
    const totalSeconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;


    console.log(
        `Recording stopped after ${minutes}:${String(seconds).padStart(2, "0")}:${String(ms).padStart(3, "0")}`
    );
    status.textContent = "Processing...";
}

document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.code === "Space" && !e.repeat) { 
        e.preventDefault();
        if (!micReady) return;
        startRecording(); 
    }
});

document.addEventListener("keyup", (e: KeyboardEvent) => {
    if (e.code === "Space") { 
        e.preventDefault();
        stopRecording(); 
    }
});

recordBtn?.addEventListener("mousedown", startRecording);
recordBtn?.addEventListener("mouseup", stopRecording);
recordBtn?.addEventListener("mouseleave", stopRecording);