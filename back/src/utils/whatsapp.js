/**
 * Utilitários para o Provedor WhatsApp (WWebJS)
 */

/**
 * Converte qualquer objeto de ID ou string para um JID puramente string (@c.us ou @g.us)
 */
function getJid(id) {
    if (!id) return '';
    if (typeof id === 'object') {
        return id._serialized || id.id || String(id);
    }
    return String(id);
}

/**
 * Resolve o ID do chat de destino, tratando se a mensagem foi enviada pelo bot (fromMe)
 * Em DMs, se fromMe for true, o chat alvo é msg.to. Se false, é msg.from.
 */
function resolveChatId(msg) {
    const rawId = msg.fromMe ? msg.to : msg.from;
    return getJid(rawId);
}

/**
 * Resolve o ID do autor da mensagem
 */
function resolveSenderId(msg, botJid) {
    if (msg.fromMe) return getJid(botJid);
    const rawAuthor = msg.author || msg.from;
    return getJid(rawAuthor);
}

module.exports = { getJid, resolveChatId, resolveSenderId };
