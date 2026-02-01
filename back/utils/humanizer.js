/**
 * Utility to simulate human-like behavior.
 */

/**
 * Creates a delay between a min and max value (milliseconds).
 * @param {number} min 
 * @param {number} max 
 */
const delay = (min = 1000, max = 3000) => {
    const ms = Math.floor(Math.random() * (max - min + 1) + min);
    return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Simulates typing state before sending a message.
 * @param {import('whatsapp-web.js').Message} msg 
 * @param {number} durationMs 
 */
const simulateTyping = async (msg, durationMs = 2000) => {
    try {
        const chat = await msg.getChat();
        await chat.sendStateTyping();
        await new Promise(resolve => setTimeout(resolve, durationMs));
        await chat.clearState();
    } catch (err) {
        console.error('[Utils] Erro ao simular digitação:', err);
    }
};

module.exports = { delay, simulateTyping };
