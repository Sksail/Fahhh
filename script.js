const startBtn = document.getElementById('start-btn');
const statusDiv = document.getElementById('status');
const audio = document.getElementById('trigger-audio');

let recognition;
let isListening = false;

function updateStatus(msg, color = "#44f688") {
  statusDiv.textContent = msg;
  statusDiv.style.color = color;
}

function startRecognition() {
  if (isListening) return;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    updateStatus("SpeechRecognition not supported in this browser.", "#ff487c");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript;
    }
    if (transcript.toLowerCase().includes("fahhhh")) {
      audio.pause();
      audio.currentTime = 0;
      audio.play();
      updateStatus("Trigger detected!");
    } else {
      updateStatus("Listening...");
    }
  };

  recognition.onstart = () => {
    isListening = true;
    updateStatus("Listening...");
    startBtn.textContent = "Listening...";
    startBtn.disabled = true;
  };

  recognition.onerror = (event) => {
    if (event.error === "not-allowed" || event.error === "denied") {
      updateStatus("Microphone access denied.", "#ff487c");
    } else if (event.error === "no-speech") {
      updateStatus("No speech detected. Trying again...", "#ffd34d");
      recognition.stop();
      recognition.start();
    } else {
      updateStatus("Recognition error: " + event.error, "#ff487c");
    }
    isListening = false;
    startBtn.textContent = "Start Listening";
    startBtn.disabled = false;
  };

  recognition.onend = () => {
    isListening = false;
    startBtn.textContent = "Start Listening";
    startBtn.disabled = false;
    updateStatus("Recognition ended.", "#fafafa");
  };

  try {
    recognition.start();
  } catch(e) {
    updateStatus("Unable to start recognition: " + e.message, "#ff487c");
  }
}

startBtn.addEventListener('click', startRecognition);

audio.addEventListener('ended', () => {
  updateStatus("Listening...");
});
audio.addEventListener('play', () => {
  // No-op; already handled above.
});