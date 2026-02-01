const { saveContact, pruneMessages } = require('../core/database');
const { handleCommand } = require('./commands');
const { simulateTyping, delay } = require('../utils/humanizer');

/**
 * Main message orchestrator.
 * Determines if a message should be handled by a command, AI transcription, or general response.
 */
async function handleMessage(msg, botId, bots, db) {
    const provider = bots[botId].provider;
    const chatId = msg.fromMe ? msg.to : msg.from;

    // Ignore updates that are not individual chats (group announcements, status, etc)
    if (!chatId || !chatId.endsWith('@c.us')) return;

    // 1. Admin Restriction (Privacy Mode)
    // Se o bot estiver em modo privado, ignoramos mensagens de terceiros
    // EXCEÇÃO: Permitimos se o usuário estiver em uma partida ativa de Jogo da Velha
    const isAdminOnly = bots[botId].adminOnly;
    const info = provider.getInfo();
    const isOwner = msg.fromMe || (info && msg.from === (info.wid?._serialized || info.me?._serialized));

    const { getGame } = require('../core/game-engine');
    const hasActiveGame = !!getGame(botId, chatId);

    if (isAdminOnly && !isOwner && !hasActiveGame) {
        return;
    }

    // 2. Database Persistence
    try {
        if (!msg.fromMe) {
            const contact = await msg.getContact();
            await saveContact(db, botId, chatId, contact.pushname || null);
        }
        await db.run(
            'INSERT INTO messages (whatsapp_id, from_number, body, is_from_me, bot_id) VALUES (?, ?, ?, ?, ?)',
            [msg.id.id, chatId, msg.body, msg.fromMe ? 1 : 0, botId]
        );
        const messageLimit = parseInt(process.env.MESSAGE_LIMIT) || 50;
        await pruneMessages(db, chatId, messageLimit);
    } catch (err) {
        // Silently fail DB errors during chat
    }

    // 3. Command & Interaction Detection (Apenas Dono se estiver em modo privado)
    if (isOwner || !isAdminOnly) {
        const isHandled = await handleCommand(msg, botId, bots, db);
        if (isHandled) return;
    }

    // 4. Game & Interaction State Handlers
    // Permitido para oponentes em partidas ativas mesmo em modo privado
    const { handleMove: handleVelhaMove } = require('./commands/velha');
    if (await handleVelhaMove(msg, botId, bots)) return;

    // 5. Audio Detection (Apenas Dono ou se não for privado)
    if ((isOwner || !isAdminOnly) && (msg.type === 'ptt' || msg.type === 'audio')) {
        try {
            console.log(`[Audio] Baixando áudio de ${chatId}...`);
            const media = await msg.downloadMedia();

            if (media && (media.mimetype.includes('audio') || media.mimetype.includes('ogg'))) {
                // Verificar se a transcrição está habilitada para este bot
                if (!bots[botId].transcriptionEnabled) {
                    console.log(`[Audio] [${botId}] Transcrição ignorada (desativada).`);
                    return;
                }

                await delay(500, 1000);
                await simulateTyping(msg, 3000);

                const { transcribeAudio } = require('../providers/gemini');
                const transcription = await transcribeAudio(media.data, media.mimetype);

                const responseText = `🎤 *Transcrição de Áudio:*\n\n"${transcription.trim()}"`;
                await msg.reply(responseText);
            }
        } catch (err) {
            console.error('[Audio] Erro no fluxo de transcrição:', err.message);
        }
        return;
    }
}

module.exports = { handleMessage };
