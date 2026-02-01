const { createGame, getGame, deleteGame, checkWinner, renderBoard } = require('../../core/game-engine');
const { getJid, resolveChatId, resolveSenderId } = require('../../utils/whatsapp');

/**
 * Comando: /velha
 * Descrição: Jogo da Velha PvP puro para DMs.
 */
module.exports = {
    name: '/velha',

    execute: async (msg, args, botId, bots) => {
        try {
            const contactId = resolveChatId(msg);
            if (contactId.endsWith('@g.us')) {
                return msg.reply('💡 O Jogo da Velha agora é exclusivo para conversas privadas (DM).');
            }

            const botInstance = bots[botId]?.provider?.client;
            if (!botInstance) return;
            const botJid = getJid(botInstance.info?.wid || botInstance.info?.me);

            const subCommand = args[0]?.toLowerCase();
            if (['sair', 'reset', 'stop'].includes(subCommand)) {
                deleteGame(botId, contactId);
                return msg.reply('🏳️ Partida encerrada.');
            }

            if (getGame(botId, contactId)) {
                return msg.reply('⚠️ Já existe uma partida aqui! Use */velha reset* para recomeçar.');
            }

            // Jogadores: Sempre Contato vs Dono
            if (contactId === botJid) {
                return msg.reply('😅 Você não pode jogar Tic-Tac-Toe contra si mesmo no chat.');
            }

            // Buscar nomes (Resolução paralela)
            const names = {};
            try {
                const [contactX, contactO] = await Promise.all([
                    botInstance.getContactById(contactId),
                    botInstance.getContactById(botJid)
                ]);
                names[contactId] = contactX.pushname || contactX.name || contactId.split('@')[0];
                names[botJid] = contactO.pushname || contactO.name || botJid.split('@')[0];
            } catch (e) {
                names[contactId] = contactId.split('@')[0];
                names[botJid] = botJid.split('@')[0];
            }

            const game = createGame(botId, contactId, contactId, botJid, names);

            const boardText = `🎮 *Jogo da Velha: PvP*\n\n` +
                `❌ ${names[contactId]}\n` +
                `⭕ ${names[botJid]}\n\n` +
                `Vez de ❌! Escolha (1-9):\n\n` +
                renderBoard(game.board);

            await safeReply(msg, boardText, [contactId], botJid);
        } catch (err) {
            console.error('[Game: /velha] Erro fatal no execute:', err);
            return msg.reply('❌ Erro técnico ao iniciar o jogo.');
        }
    },

    handleMove: async (msg, botId, bots) => {
        try {
            const contactId = resolveChatId(msg);
            const game = getGame(botId, contactId);
            if (!game || game.status !== 'active') return false;

            const body = msg.body.trim();
            const move = parseInt(body);
            if (isNaN(move) || move < 1 || move > 9 || body.length > 1) return false;

            const botInstance = bots[botId]?.provider?.client;
            const botJid = getJid(botInstance?.info?.wid || botInstance?.info?.me);
            const actualSender = resolveSenderId(msg, botJid);

            const currentPlayerId = game.players[game.turn];

            if (actualSender !== currentPlayerId) {
                await msg.reply(`⚠️ Espere sua vez! Agora é a vez de ${game.turn === 'X' ? '❌' : '⭕'}.`);
                return true;
            }

            const idx = move - 1;
            if (game.board[idx] !== null) {
                await msg.reply('⛔ Posição já ocupada.');
                return true;
            }

            // Executar Jogada
            game.board[idx] = game.turn;
            game.lastUpdate = Date.now();

            const winner = checkWinner(game.board);
            if (winner) {
                await announceResult(msg, botId, botJid, contactId, game, winner);
                return true;
            }

            // Próximo Turno
            game.turn = game.turn === 'X' ? 'O' : 'X';
            const nextPlayerId = game.players[game.turn];
            const senderName = game.names[actualSender] || actualSender.split('@')[0];
            const nextPlayerName = game.names[nextPlayerId] || nextPlayerId.split('@')[0];

            const text = `📍 *Jogada de ${senderName}*\n\n` +
                renderBoard(game.board) +
                `Vez de ${nextPlayerName} (${game.turn === 'X' ? '❌' : '⭕'})!`;

            await safeReply(msg, text, [nextPlayerId, actualSender], botJid);
            return true;
        } catch (err) {
            console.error('[Game: /velha] Erro no handleMove:', err);
            return false;
        }
    }
};

/**
 * Funções Auxiliares de UI (Privadas)
 */

async function announceResult(msg, botId, botJid, contactId, game, winner) {
    let resultText = '';
    if (winner === 'draw') {
        resultText = '🤝 *Empate! Deu velha.*';
    } else {
        const winnerId = game.players[winner];
        const winnerName = game.names[winnerId] || winnerId.split('@')[0];
        resultText = `🏆 *Vitória de ${winnerName} (${winner === 'X' ? '❌' : '⭕'})!*`;
    }

    const finishers = Object.values(game.players);
    await safeReply(msg, resultText + '\n\n' + renderBoard(game.board), finishers, botJid);
    deleteGame(botId, contactId);
}

/**
 * Envia uma resposta tratando falhas em menções e filtrando o bot
 */
async function safeReply(msg, text, mentionJids, botJid) {
    try {
        const mentions = mentionJids.filter(id => id && id !== botJid && typeof id === 'string');
        return await msg.reply(text, { mentions });
    } catch (e) {
        return await msg.reply(text.replace(/@/g, ''));
    }
}
