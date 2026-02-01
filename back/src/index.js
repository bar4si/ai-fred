const { setupDatabase } = require('./core/database');
const { initializeBot, getBots } = require('./core/bot-manager');
const { showGlobalDashboard, rl } = require('./ui/dashboard');
const { showBotMenu } = require('./ui/bot-menu');
const { startApiServer } = require('./core/api-server');
const path = require('path');
const fs = require('fs');

async function start() {
    console.log('🚀 Iniciando AI-Fred Multi-Bot...');

    // 1. Inicializar Banco de Dados
    const db = await setupDatabase();
    const bots = getBots();

    /**
     * 💡 INJEÇÃO DE DEPENDÊNCIA:
     * Para trocar o provedor de WhatsApp, basta alterar a constante abaixo.
     * - WWebJSProvider: Usa whatsapp-web.js (simulação de navegador)
     * - OfficialAPIProvider: Usa a API Cloud da Meta (requer Webhook e Token)
     */
    const WWebJSProvider = require('./providers/wwebjs-provider');
    // const OfficialAPIProvider = require('./providers/official-api-provider');

    const SelectedProvider = WWebJSProvider; // Altere aqui para OfficialAPIProvider se desejar

    // 2. Orquestrador de UI (funções circulares resolvidas via injeção)
    const initFn = (id) => initializeBot(id, db, SelectedProvider);
    const dashboardFn = () => showGlobalDashboard(bots, db, initFn, menuFn);
    const menuFn = (id) => showBotMenu(id, bots, db, rl, dashboardFn);

    // 3. Boot inicial de todas as sessões conhecidas
    const authPath = path.join(__dirname, '../.wwebjs_auth');
    let sessions = [];
    if (fs.existsSync(authPath)) {
        const folders = fs.readdirSync(authPath).filter(f => fs.lstatSync(path.join(authPath, f)).isDirectory());
        sessions = [...new Set(folders.map(s => s.replace('session-', '') || 'session'))];
    }

    if (sessions.length > 0) {
        console.log(`📦 Carregando ${sessions.length} sessões...`);
        for (const s of sessions) {
            await initializeBot(s, db, SelectedProvider);
            // Delay de 1.5s para evitar que múltiplos Puppeteers tentem travar arquivos ao mesmo tempo
            await new Promise(r => setTimeout(r, 500));
        }
    }

    // 4. Iniciar Servidor de API
    startApiServer(bots, db, initFn);

    // 5. Mostrar o Dashboard
    dashboardFn();
}

start().catch(err => {
    console.error('❌ Erro Fatal no Bootstrap:', err);
    process.exit(1);
});
