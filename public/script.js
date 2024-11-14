// script.js
const startButton = document.getElementById('startButton');
const speakButton = document.getElementById('speakButton');
const languageSelect = document.getElementById('languageSelect');
const originalText = document.getElementById('originalText');
const translatedText = document.getElementById('translatedText');

// Google Cloud Speech-to-Text API
let recognition;
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = async (event) => {
    const transcript = event.results[event.resultIndex][0].transcript;
    originalText.textContent = transcript;
    try {
      const translated = await translateText(transcript);
      translatedText.textContent = translated;
      speakButton.style.display = 'inline-block';
    } catch (error) {
      translatedText.textContent = "Error translating text. Please try again.";
      console.error('Error in translation:', error);
    }
  };

  recognition.onerror = (event) => {
    originalText.textContent = "Error recognizing speech. Please try again.";
    console.error('Speech recognition error:', event.error);
  };
} else {
  alert("Speech Recognition is not supported in this browser.");
}

startButton.addEventListener('click', () => {
  if (recognition) {
    recognition.start();
  }
});

// DeepL API for Translation via serverless function
async function translateText(text) {
  const targetLang = languageSelect.value.toUpperCase(); // Get selected language

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, targetLang }),
    });

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error('Error in translation:', error);
    throw new Error('Translation API request failed');
  }
}

// Speak the translated text
speakButton.addEventListener('click', () => {
  const text = translatedText.textContent;

  if (!text) {
    alert("No translation available to speak.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);

  // Set the correct language for speech synthesis based on selected language
  switch (languageSelect.value) {
    case 'en':
      utterance.lang = 'en-US';
      break;
    case 'es':
      utterance.lang = 'es-ES';
      break;
    case 'fr':
      utterance.lang = 'fr-FR';
      break;
    case 'de':
      utterance.lang = 'de-DE';
      break;
    case 'ar':
      utterance.lang = 'ar-SA'; // Arabic
      break;
    case 'bg':
      utterance.lang = 'bg-BG'; // Bulgarian
      break;
    case 'cs':
      utterance.lang = 'cs-CZ'; // Czech
      break;
    case 'da':
      utterance.lang = 'da-DK'; // Danish
      break;
    case 'el':
      utterance.lang = 'el-GR'; // Greek
      break;
    case 'et':
      utterance.lang = 'et-EE'; // Estonian
      break;
    case 'fi':
      utterance.lang = 'fi-FI'; // Finnish
      break;
    case 'hi':
      utterance.lang = 'hi-IN'; // Hindi
      break;
    default:
      utterance.lang = 'en-US'; // Default to English if no match
  }

  // Speak the translated text
  speechSynthesis.speak(utterance);
});
