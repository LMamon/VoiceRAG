export function playTTS(text: string): Promise<void> {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onend = () => resolve();

    speechSynthesis.cancel(); // stops any queued speech
    speechSynthesis.speak(utterance);
  });
} 