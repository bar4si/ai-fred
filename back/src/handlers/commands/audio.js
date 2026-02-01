const { setBotSetting } = require('../../core/database');

/**
 * Comando: /audio
 * Descrição: Ativa ou desativa a transcrição automática de áudio.
 */
module.exports = {
    name: '/audio',
    execute: async (msg, args, botId, bots, db) => {
        // Apenas o dono (fromMe) ou em modo admin se permitido
        if (!msg.fromMe) {
            return msg.reply('❌ Apenas o administrador pode alterar as configurações de áudio.');
        }

        const action = args[0] ? args[0].toLowerCase() : null;

        if (action === 'on' || action === 'ligar') {
            await setBotSetting(db, botId, 'transcription_enabled', 1);
            bots[botId].transcriptionEnabled = true;
            return msg.reply('🎤 *Transcrição automática ATIVADA!* ✨\nA partir de agora, todo áudio recebido será transcrito.');
        }

        if (action === 'off' || action === 'desligar') {
            await setBotSetting(db, botId, 'transcription_enabled', 0);
            bots[botId].transcriptionEnabled = false;
            return msg.reply('🔇 *Transcrição automática DESATIVADA.*');
        }

        const status = bots[botId].transcriptionEnabled ? 'ATIVADA' : 'DESATIVADA';
        const helpText = `🎤 *Configuração de Áudio*\n\n` +
            `O estado atual é: *${status}*\n\n` +
            `Use:\n` +
            `*/audio on* - Para ligar\n` +
            `*/audio off* - Para desligar`;

        await msg.reply(helpText);
    }
};
