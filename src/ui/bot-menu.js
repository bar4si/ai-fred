const qrcode = require('qrcode-terminal');
const { getDatabaseStats, listUniqueUsers, listMessages, cleanupDatabase, clearAllMessages, setBotSetting } = require('../core/database');

async function showBotMenu(botId, bots, db, rl, showGlobalDashboard) {
    const bot = bots[botId];
    if (!bot) return showGlobalDashboard();

    if (bot.qr) {
        console.clear();
        console.log(`\n📱 --- QR CODE: [${botId}] ---`);
        qrcode.generate(bot.qr, { small: true });
        console.log('\nEscaneie para conectar. ENTER para voltar.');
        await new Promise(res => rl.question('', res));
        return showGlobalDashboard();
    }

    const stats = await getDatabaseStats(db, botId);
    console.clear();
    console.log(`\n--- 🛠️  GERENCIANDO: [${botId}] ---`);
    console.log(`Status: ${bot.status}`);
    console.log(`📊 Banco: ${stats.contacts} Contatos | ${stats.messages} Mensagens`);
    console.log('---------------------------');
    console.log('1. Listar Contatos');
    console.log('2. Ver Histórico (Top 30)');
    console.log('3. Status Detalhado');
    console.log('4. Executar Faxina');
    console.log('5. Apagar Mensagens (Reset)');
    console.log(`6. Modo: ${bot.adminOnly ? '🔒 PRIVADO' : '🌐 PÚBLICO'}`);
    console.log('9. VOLTAR AO PAINEL GLOBAL');
    console.log('---------------------------');

    rl.question('Escolha: ', async (opt) => {
        if (!opt) return showBotMenu(botId, bots, db, rl, showGlobalDashboard);

        switch (opt) {
            case '1':
                const users = await listUniqueUsers(db, botId);
                console.log('\n📇 CONTATOS:');
                users.forEach(u => console.log(`- ${u.contact_name || 'Sem Nome'} (${u.from_number})`));
                break;
            case '2':
                const msgs = await listMessages(db, botId);
                console.log('\n📊 ÚLTIMAS MENSAGENS:');
                const info = bot.provider.getInfo();
                const profileName = info ? info.pushname : 'Fred';
                msgs.forEach(m => {
                    const contact = m.contact_name ? `${m.contact_name} (${m.from_number})` : m.from_number;
                    const direction = m.is_from_me ? `🔹 [${profileName}] -> ${contact}` : `${contact} -> 🔹 [${profileName}]`;
                    console.log(`[${m.timestamp}] ${direction}: ${m.body.substring(0, 50).replace(/\n/g, ' ')}`);
                });
                break;
            case '3':
                console.log('\n📡 STATUS:');
                const botInfo = bot.provider.getInfo();
                if (botInfo) console.log(`- Nome: ${botInfo.pushname}\n- Número: ${botInfo.wid.user}`);
                else console.log('- Bot ainda não está pronto.');
                break;
            case '4':
                await cleanupDatabase(db, botId);
                break;
            case '5':
                const confirm = await new Promise(res => rl.question('⚠️ Resetar mensagens? (s/n): ', res));
                if (confirm.toLowerCase() === 's') await clearAllMessages(db, botId);
                break;
            case '6':
                const newMode = !bot.adminOnly;
                bot.adminOnly = newMode;
                await setBotSetting(db, botId, 'admin_only', newMode ? 1 : 0);
                console.log(`✅ Modo alterado para: ${newMode ? '🔒 PRIVADO' : '🌐 PÚBLICO'}`);
                break;
            case '9':
                return showGlobalDashboard();
        }
        console.log('\nPressione ENTER para continuar...');
        await new Promise(res => rl.question('', res));
        showBotMenu(botId, bots, db, rl, showGlobalDashboard);
    });
}

module.exports = { showBotMenu };
