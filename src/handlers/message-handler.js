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

    // 2. Command Detection
    const isCommand = await handleCommand(msg);
    if (isCommand) return;

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
                console.log(`[Audio] Transcrição enviada para ${chatId}`);
            }
        } catch (err) {
            console.error('[Audio] Erro no fluxo de transcrição:', err.message);
            // Opcional: avisar ao usuário ou falhar silenciosamente
        }
        return;
    }

    // 4. Manual Triggers
    const isTriggerFred = msg.body.toLowerCase() === 'fred';

    // Ignore the rest if it's our own message and not a command
    if (!isTriggerFred && msg.fromMe) return;

    // 5. Admin Restriction (Privacy Mode)
    const isAdminOnly = bots[botId].adminOnly;
    const info = provider.getInfo();
    if (isAdminOnly && !msg.fromMe && info && msg.from !== info.wid._serialized) {
        return;
    }

    // 6. Natural Interaction
    if (isTriggerFred) {
        await delay(500, 1500);
        await simulateTyping(msg, 1500);
        msg.reply('Olá! Eu sou o AI-Fred. Como posso ajudar?\n\nDigite */ajuda*.');
    }
}

module.exports = { handleMessage };
