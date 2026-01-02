export function createSTT({ onText, onError }) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (e) => onText(e.results[0][0].transcript);
  recognition.onerror = (e) => onError?.(e.error);

  return {
    start: () => recognition.start(),
    stop: () => recognition.stop(),
  };
}