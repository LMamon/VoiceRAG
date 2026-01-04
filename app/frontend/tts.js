export function playTTS(text) {
    return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = resolve;
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
    })
}