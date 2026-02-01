const { generateChatResponse } = require('../../providers/gemini');

/**
 * Comando: /fred
 * Descrição: Interação direta com o Google Gemini.
 */
module.exports = {
    name: '/fred',
    execute: async (msg, args) => {
        const userPrompt = args.join(' ');

        if (!userPrompt) {
            return msg.reply('🤖 Olá! Eu sou o AI-Fred. Para conversar comigo, use:\n\n*/fred [sua pergunta ou mensagem]*');
        }

        try {
            const response = await generateChatResponse(userPrompt);
            await msg.reply(response);
        } catch (err) {
            console.error('[Command: /fred] Erro:', err.message);
            await msg.reply('❌ Desculpe, não consegui processar seu pedido agora.');
        }
    }
};
