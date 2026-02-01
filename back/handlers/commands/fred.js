/**
 * Comando: fred
 * Descrição: Gatilho de interação natural (sem prefixo).
 */
module.exports = {
    name: 'fred',
    isKeyword: true,
    execute: async (msg) => {
        // O dispatcher já cuida do delay e simulador de digitação globalmente
        msg.reply('Olá! Eu sou o AI-Fred. Como posso ajudar?\n\nDigite */ajuda*.');
    }
};
