/**
 * Comando: /sticker
 * Descrição: Converte imagens em stickers do WhatsApp.
 */
module.exports = {
    name: '/sticker',
    execute: async (msg) => {
        let media;
        try {
            if (msg.hasMedia) {
                media = await msg.downloadMedia();
            } else if (msg.hasQuotedMsg) {
                const quotedMsg = await msg.getQuotedMessage();
                if (quotedMsg.hasMedia) {
                    media = await quotedMsg.downloadMedia();
                }
            }

            if (!media || !media.mimetype.startsWith('image/')) {
                return msg.reply('❌ Por favor, envie uma imagem com a legenda `/sticker` ou responda a uma imagem existente.');
            }

            await msg.reply('⏳ Criando sua figurinha...');
            await msg.reply(media, null, { sendMediaAsSticker: true });
        } catch (error) {
            console.error('[Sticker] Erro:', error);
            await msg.reply('❌ Erro ao gerar figurinha.');
        }
    }
};
