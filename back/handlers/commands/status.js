/**
 * Comando: /status
 * Descrição: Exibe o estado de saúde e uptime do sistema.
 */
module.exports = {
    name: '/status',
    execute: async (msg) => {
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        await msg.reply(`🤖 *AI-Fred Status*\n\n✅ Sistema: Online\n⏳ Uptime: ${hours}h ${minutes}m\n📡 Conexão: Estável`);
    }
};
