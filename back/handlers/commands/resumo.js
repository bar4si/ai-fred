const { generateChatResponse } = require('../../providers/gemini');

/**
 * Comando: /resumo
 * Descrição: Utiliza IA para resumir conversas recentes.
 */
module.exports = {
    name: '/resumo',
    execute: async (msg) => {
        try {
            await msg.reply(`📝 Analisando conversas recentes para gerar o resumo...`);

            const summary = await generateChatResponse("Por favor, faça um resumo amigável e conciso das últimas mensagens de uma conversa de WhatsApp.");
            await msg.reply(`✨ *Resumo IA:*\n\n${summary}`);
        } catch (error) {
            await msg.reply('❌ Erro ao gerar resumo via IA.');
        }
    }
};
