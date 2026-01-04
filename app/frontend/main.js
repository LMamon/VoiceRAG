import { createSTT } from "./stt.js";
import { playTTS } from "./tts.js";

let isRecording = false;
let startTime = null;
let lastDurationMs = null;

const enableMicBtn = document.getElementById("enableMicBtn");
const recordBtn = document.getElementById("recordBtn");
const status = document.createElement("div");
const output = document.createElement("pre");

document.body.appendChild(status)
document.body.appendChild(output)

//// TODO: token based trimming is going to get replaced when transcripts get too long

// enableMicBtn.addEventListener("click", async () => {
//     try {
//         await navigator.mediaDevices.getUserMedia({ audio: true});
//         status.textContent = "Microphone enabled";
//         enableMicBtn.style.display = "none";
//     } catch (err) {
//         status.textContent = "Mic permission denied";
//         console.error(err);
//     }
// })

const stt = createSTT({
    onText: async (text) => {
        console.log("final:", text);

        status.textContent = "Thinking..."
        
        const res = await fetch("http://localhost:8000/query", {
            method: "POST",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify({ 
                text,
                duration_ms: lastDurationMs,
             }),
        });
        
        const { response } = await res.json();
        status.textContent = "Speaking..."
        await playTTS(response);
        
        output.textContent = "Model: " + response;
        status.textContent = "Done";
    },
    onError: (err) => console.error("speech error:", err),
});

function startRecording() {
    if (isRecording) return;
    isRecording = true;
    startTime = performance.now();
    status.textContent = "Recording...";
    stt.start();
}

function stopRecording() {
    if (!isRecording) return;
    isRecording = false;

    const elapsed = performance.now() - startTime;
    lastDurationMs = Math.floor(elapsed);
    startTime = null;

    const ms = Math.floor(elapsed % 1000);
    const totalSeconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    stt.stop();
    console.log(
        `Recording stopped after ${minutes}:${String(seconds).padStart(2, "0")}:${String(ms).padStart(3, "0")}`
        );
    status.textContent = "Processing..."
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !e.repeat) { 
        e.preventDefault(); startRecording(); 
    }
});
document.addEventListener("keyup", (e) => {
    if (e.code === "Space") { 
        e.preventDefault(); stopRecording(); 
    }
});

recordBtn.addEventListener("mousedown", startRecording);
recordBtn.addEventListener("mouseup", stopRecording);
recordBtn.addEventListener("mouseleave", stopRecording);
