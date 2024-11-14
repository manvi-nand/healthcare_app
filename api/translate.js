// /api/translate.js
const fetch = require('node-fetch');  // Make sure to install node-fetch

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { text, targetLang } = req.body;

    // Get the DeepL API key from environment variables
    const apiKey = process.env.DEEPL_API_KEY;  // Set your DeepL API key in Vercel dashboard

    try {
      const response = await fetch(`https://api-free.deepl.com/v2/translate?auth_key=${apiKey}&text=${encodeURIComponent(text)}&target_lang=${targetLang}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (!response.ok) {
        throw new Error(`Translation failed with status: ${response.status}`);
      }

      const data = await response.json();
      res.status(200).json({ translatedText: data.translations[0].text });
    } catch (error) {
      console.error('Error in translation API:', error);
      res.status(500).json({ error: 'Translation failed' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
