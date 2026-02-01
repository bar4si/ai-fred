const { getBotSetting, cleanupDatabase } = require('./database');
const { handleMessage } = require('../handlers/message-handler');

/**
 * Registro Global de Bots ativos.
 */
const bots = {};
let db;

/**
 * Inicializa uma instância de bot utilizando Injeção de Dependência.
 * 
 * @param {string} botId Identificador único da sessão.
 * @param {object} database Instância do banco de dados SQLite.
 * @param {Function} ProviderClass A classe/construtor do provedor (Ex: WWebJSProvider).
 *                               Esta é a peça chave da Injeção de Dependência.
 */
async function initializeBot(botId, database, ProviderClass) {
    if (bots[botId]) return;
    db = database;

    // INJEÇÃO: Criamos a instância do provedor que foi passado por argumento.
    // Isso permite trocar whatsapp-web.js por API Oficial sem mudar este arquivo.
    const provider = new ProviderClass(botId);

    bots[botId] = {
        provider,
        status: 'Iniciando...',
        lastStats: { messages: 0, contacts: 0 },
        adminOnly: (await getBotSetting(db, botId, 'admin_only', 0)) === 1,
        qr: null
    };

    // Escutando eventos padronizados do contrato de Provedor
    provider.on('qr', (qr) => {
        bots[botId].status = 'Aguardando QR Code 📱';
        bots[botId].qr = qr;
    });

    provider.on('authenticated', () => {
        bots[botId].status = 'Autenticado! ✨';
        bots[botId].qr = null;
    });

    provider.on('loading_screen', (percent) => {
        bots[botId].status = `Carregando (${percent}%) ⏳`;
    });

    provider.on('ready', () => {
        bots[botId].status = 'Online ✅';
        bots[botId].qr = null;
        cleanupDatabase(db, botId);
    });

    provider.on('disconnected', () => {
        bots[botId].status = 'Desconectado ❌';
    });

    // O BotManager apenas repassa a mensagem para o handler
    provider.on('message', async (msg) => {
        // Adaptamos o objeto bots para o handler se necessário, 
        // mas aqui mantemos a compatibilidade.
        await handleMessage(msg, botId, bots, db);
    });

    // Inicia o processo de conexão do provedor
    try {
        console.log(`[BotManager] [${botId}] Chamando provider.initialize()...`);
        await provider.initialize();
        console.log(`[BotManager] [${botId}] Provedor inicializado.`);
    } catch (err) {
        console.error(`[BotManager] [${botId}] Erro na inicialização:`, err);
        bots[botId].status = 'Erro na Inicialização ❌';
    }
}

/**
 * Retorna o registro de bots ativos.
 */
const getBots = () => bots;

module.exports = { initializeBot, getBots };
