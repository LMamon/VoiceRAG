import { createSTT } from "./stt.js";

let isRecording = false;

const recordBtn = document.getElementById("recordBtn");

const stt = createSTT({
    onText: async (text) => {
        console.log("final:", text);

        const res = await fetch("/query", {
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
    stt.start();
}

function stopRecording() {
    if (!isRecording) return;
    isRecording = false;
    stt.stop();
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
