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

    // 1. Database Persistence
    try {
        if (!msg.fromMe) {
            const contact = await msg.getContact();
            await saveContact(db, botId, chatId, contact.pushname || null);
        }
        await db.run(
            'INSERT INTO messages (whatsapp_id, from_number, body, is_from_me, bot_id) VALUES (?, ?, ?, ?, ?)',
            [msg.id.id, chatId, msg.body, msg.fromMe ? 1 : 0, botId]
        );
        await pruneMessages(db, chatId, 50);
    } catch (err) {
        // Silently fail DB errors during chat
    }

    // 2. Command & Interaction Detection (Prefixed or Keywords)
    const isHandled = await handleCommand(msg);
    if (isHandled) return;

    // 3. Audio Detection (Google Gemini Transcription)
    if (msg.type === 'ptt' || msg.type === 'audio') {
        try {
            console.log(`[Audio] Baixando áudio de ${chatId}...`);
            const media = await msg.downloadMedia();

            if (media && (media.mimetype.includes('audio') || media.mimetype.includes('ogg'))) {
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

    // 4. Admin Restriction (Privacy Mode)
    // O MessageHandler ainda cuida das restrições de privacidade globais
    const isAdminOnly = bots[botId].adminOnly;
    const info = provider.getInfo();

    // Ignore message if adminOnly is on and user is not owner
    if (isAdminOnly && !msg.fromMe && info && msg.from !== info.wid._serialized) {
        return;
    }
}

module.exports = { handleMessage };
