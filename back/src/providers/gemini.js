require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Transcribes audio using Google Gemini.
 * Gemini can handle audio files directly if provided in the correct format.
 * @param {string} base64Data 
 * @param {string} mimeType 
 */
async function transcribeAudio(base64Data, mimeType) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY não configurada no .env');
        }

        const modelName = (process.env.GEMINI_MODEL || "gemini-1.5-flash").trim();
        const model = genAI.getGenerativeModel({ model: modelName });

        const prompt = "Transcreva este áudio para texto. Se for uma mensagem de voz, apenas escreva o que foi dito de forma literal. Se houver ruído ou não for possível entender, avise.";

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType
                }
            }
        ]);

        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('[Gemini Provider] Erro na transcrição:', error.message);
        throw error;
    }
}

/**
 * Generates a text response for a given prompt.
 * @param {string} prompt 
 */
async function generateChatResponse(userPrompt) {
    try {
        const modelName = (process.env.GEMINI_MODEL || "gemini-1.5-flash").trim();
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('[Gemini Provider] Erro no chat:', error);
        return 'Desculpe, tive um problema ao processar seu pedido via IA.';
    }
}

module.exports = { transcribeAudio, generateChatResponse };
