/**
 * Comando: /ajuda
 * Descrição: Exibe o menu de comandos disponíveis.
 */
module.exports = {
    name: '/ajuda',
    execute: async (msg) => {
        const helpText = `🤖 *Comandos do AI-Fred*\n\n` +
            `*/status* - Verifica o estado do bot.\n` +
            `*/sticker* - Cria figurinha de uma imagem (use na legenda ou responda a uma foto).\n` +
            `*/clima [cidade]* - Consulta o clima atual.\n` +
            `*/resumo* - Gera um resumo das mensagens recentes.\n` +
            `*/ajuda* - Mostra esta lista.`;
        await msg.reply(helpText);
    }
};
