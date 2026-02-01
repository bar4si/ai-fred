const { createGame, getGame, deleteGame, checkWinner, renderBoard } = require('../../core/game-engine');

/**
 * Comando: /velha
 * Descrição: Jogo da Velha PvP puro. Exclusivo para DMs.
 */
module.exports = {
    name: '/velha',
    execute: async (msg, args, botId, bots) => {
        try {
            const getJid = (id) => {
                if (!id) return '';
                return (typeof id === 'object' && id._serialized) ? id._serialized : String(id);
            };

            const contactId = getJid(msg.fromMe ? msg.to : msg.from);
            const subCommand = args[0]?.toLowerCase();
            const isGroup = contactId.endsWith('@g.us');

            if (isGroup) {
                return msg.reply('💡 O Jogo da Velha agora é exclusivo para conversas privadas (DM).');
            }

            const botInstance = bots[botId]?.provider?.client;
            if (!botInstance) return;
            const botJid = getJid(botInstance.info?.wid || botInstance.info?.me);

            if (subCommand === 'sair' || subCommand === 'reset' || subCommand === 'stop') {
                deleteGame(botId, contactId);
                return msg.reply('🏳️ Partida encerrada.');
            }

            if (getGame(botId, contactId)) {
                return msg.reply('⚠️ Já existe uma partida aqui! Use */velha reset* para recomeçar.');
            }

            const playerX = contactId;
            const playerO = botJid;

            if (playerX === playerO) {
                return msg.reply('😅 Você não pode jogar Tic-Tac-Toe contra si mesmo no chat.');
            }

            // BUSCAR NOMES DOS JOGADORES
            const names = {};
            try {
                const contactX = await botInstance.getContactById(playerX);
                const contactO = await botInstance.getContactById(playerO);
                names[playerX] = contactX.pushname || contactX.name || playerX.split('@')[0];
                names[playerO] = contactO.pushname || contactO.name || playerO.split('@')[0];
            } catch (e) {
                names[playerX] = playerX.split('@')[0];
                names[playerO] = playerO.split('@')[0];
            }

            const game = createGame(botId, contactId, playerX, playerO, names);

            const text = `🎮 *Jogo da Velha: PvP*\n\n` +
                `❌ ${names[playerX]}\n` +
                `⭕ ${names[playerO]}\n\n` +
                `Vez de ❌! Escolha (1-9):\n\n` +
                renderBoard(game.board);

            const mentionList = [playerX, playerO].filter(id => id && id !== botJid);

            try {
                return await msg.reply(text, { mentions: mentionList });
            } catch (replyErr) {
                return await msg.reply(text.replace(/@/g, ''));
            }
        } catch (err) {
            console.error('[Game: /velha] Erro no execute:', err);
            return msg.reply('❌ Erro técnico ao iniciar o jogo.');
        }
    },

    handleMove: async (msg, botId, bots, db) => {
        try {
            const getJid = (id) => {
                if (!id) return '';
                return (typeof id === 'object' && id._serialized) ? id._serialized : String(id);
            };

            const contactId = getJid(msg.fromMe ? msg.to : msg.from);
            const game = getGame(botId, contactId);
            if (!game || game.status !== 'active') return false;

            const body = msg.body.trim();
            const move = parseInt(body);
            if (isNaN(move) || move < 1 || move > 9 || body.length > 1) return false;

            const botInstance = bots[botId]?.provider?.client;
            const botJid = getJid(botInstance?.info?.wid || botInstance?.info?.me);
            const actualSender = getJid(msg.fromMe ? botJid : (msg.author || msg.from));

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

            game.board[idx] = game.turn;
            game.lastUpdate = Date.now();

            let winner = checkWinner(game.board);
            if (winner) return await finishGame(msg, botId, botJid, contactId, game, winner);

            game.turn = game.turn === 'X' ? 'O' : 'X';
            const nextPlayerId = game.players[game.turn];
            const senderName = game.names[actualSender] || actualSender.split('@')[0];
            const nextPlayerName = game.names[nextPlayerId] || nextPlayerId.split('@')[0];

            const text = `📍 *Jogada de ${senderName}*\n\n` +
                renderBoard(game.board) +
                `Vez de ${nextPlayerName} (${game.turn === 'X' ? '❌' : '⭕'})!`;

            const mentionList = [nextPlayerId, actualSender].filter(id => id && id !== botJid);

            try {
                await msg.reply(text, { mentions: mentionList });
            } catch (err) {
                await msg.reply(text.replace(/@/g, ''));
            }
            return true;
        } catch (err) {
            console.error('[Game: /velha] Erro no handleMove:', err);
            return false;
        }
    }
};

async function finishGame(msg, botId, botJid, contactId, game, winner) {
    try {
        let resultText = '';
        if (winner === 'draw') {
            resultText = '🤝 *Empate! Deu velha.*';
        } else {
            const winnerId = game.players[winner];
            const winnerName = game.names[winnerId] || winnerId.split('@')[0];
            resultText = `🏆 *Vitória de ${winnerName} (${winner === 'X' ? '❌' : '⭕'})!*`;
        }

        const mentionList = Object.values(game.players).filter(id => id && id !== botJid);

        try {
            await msg.reply(resultText + '\n\n' + renderBoard(game.board), {
                mentions: mentionList
            });
        } catch (err) {
            await msg.reply((resultText + '\n\n' + renderBoard(game.board)).replace(/@/g, ''));
        }

        deleteGame(botId, contactId);
        return true;
    } catch (err) {
        console.error('[Game: /velha] Erro no finishGame:', err);
        deleteGame(botId, contactId);
        return true;
    }
}
