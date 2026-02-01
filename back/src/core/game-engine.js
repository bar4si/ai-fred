/**
 * Game Engine: Jogo da Velha
 * Gerencia o estado das partidas em memória.
 */

const games = {}; // "botId:chatId" -> game state

function createGame(botId, chatId, playerX, playerO, names = {}) {
    const key = `${botId}:${chatId}`;
    games[key] = {
        board: Array(9).fill(null),
        players: {
            X: playerX,
            O: playerO
        },
        names: names, // { JID: "Nome" }
        turn: 'X', // X sempre começa
        lastUpdate: Date.now(),
        status: 'active'
    };
    return games[key];
}

function getGame(botId, chatId) {
    const key = `${botId}:${chatId}`;
    // Limpar jogos inativos (mais de 10 min)
    if (games[key] && Date.now() - games[key].lastUpdate > 600000) {
        delete games[key];
        return null;
    }
    return games[key];
}

function deleteGame(botId, chatId) {
    const key = `${botId}:${chatId}`;
    delete games[key];
}

function checkWinner(board) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
        [0, 4, 8], [2, 4, 6]             // Diagonais
    ];

    for (const [a, b, c] of lines) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    if (!board.includes(null)) return 'draw';
    return null;
}

function renderBoard(board) {
    const emojis = {
        X: '❌',
        O: '⭕',
        null: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']
    };

    let text = '';
    for (let i = 0; i < 9; i++) {
        text += board[i] ? emojis[board[i]] : emojis.null[i];
        if ((i + 1) % 3 === 0) text += '\n';
        else text += ' | ';
    }
    return text;
}

module.exports = { createGame, getGame, deleteGame, checkWinner, renderBoard };
