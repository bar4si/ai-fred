/**
 * Game Engine: Jogo da Velha
 * Gerencia o estado das partidas em memória de forma performática e segura.
 */

const games = new Map(); // "botId:chatId" -> game state

// Intervalo de limpeza proativa (a cada 5 minutos limpa jogos com mais de 10 min de inatividade)
setInterval(() => {
    const now = Date.now();
    for (const [key, game] of games.entries()) {
        if (now - game.lastUpdate > 600000) {
            console.log(`[GameEngine] Limpeza proativa: Partida encerrada por inatividade (${key})`);
            games.delete(key);
        }
    }
}, 300000);

function createGame(botId, chatId, playerX, playerO, names = {}) {
    const key = `${botId}:${chatId}`;
    const gameState = {
        board: Array(9).fill(null),
        players: {
            X: playerX,
            O: playerO
        },
        names: names,
        turn: 'X',
        lastUpdate: Date.now(),
        status: 'active'
    };
    games.set(key, gameState);
    return gameState;
}

function getGame(botId, chatId) {
    const key = `${botId}:${chatId}`;
    return games.get(key) || null;
}

function deleteGame(botId, chatId) {
    const key = `${botId}:${chatId}`;
    games.delete(key);
}

function checkWinner(board) {
    const winLines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const [a, b, c] of winLines) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    if (!board.includes(null)) return 'draw';
    return null;
}

/**
 * Renderiza o tabuleiro usando emojis
 */
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

module.exports = {
    createGame,
    getGame,
    deleteGame,
    checkWinner,
    renderBoard
};
