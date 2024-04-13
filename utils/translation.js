  const { GoogleGenerativeAI } = require('@google/generative-ai');
  // Function to translate text
  async function translateText(text, targetLanguage) {
    console.log(text);
    // Create a GoogleGenerativeAI client
    const client = new GoogleGenerativeAI("AIzaSyDV3kgFvSYejSHDcNjUOJRVxFRUu4Wenzs");

    // Define the model and prompt
    const model = 'gemini-pro';
    const prompt = `Translate the text "${text}" to ${targetLanguage}.`;
    console.log(prompt);
    try {
      // Generate the translation
      const gen = client.getGenerativeModel({model});
      const response = await gen.generateContent(prompt);
      const almost = await response.response;
      const translatedText = almost.text();
      console.log(translatedText);
      // Return the translated text
      return translatedText;
    } catch (error) {
      console.error('Error during translation:', error);
      throw error;
    }
  }

  module.exports = translateText;