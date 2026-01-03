import { createSTT } from "./stt.js";

let isRecording = false;
let startTime = null;

const recordBtn = document.getElementById("recordBtn");
const output = document.createElement("pre");
document.body.appendChild(output)

const stt = createSTT({
    onText: async (text) => {
        console.log("final:", text);

        const res = await fetch("http://localhost:8000/query", {
            method: "POST",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });
        
        const data = await res.json();
        console.log("model response:", data.response);
    },
    onError: (err) => console.error("speech error:", err),
});

function startRecording() {
    if (isRecording) return;
    isRecording = true;
    startTime = performance.now();
    console.log("Recording...");
    stt.start();
}

function stopRecording() {
    if (!isRecording) return;
    isRecording = false;

    const elapsed = performance.now() - startTime;
    startTime = null;

    const ms = Math.floor(elapsed % 1000);
    const totalSeconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    stt.stop();
    console.log(
        `recording stopped after ${minutes}:${String(seconds).padStart(2, "0")}:${String(ms).padStart(3, "0")}`
        );
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
