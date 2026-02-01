const axios = require('axios');

/**
 * Comando: /clima [cidade]
 * Descrição: Consulta o clima via HG Brasil API.
 */
module.exports = {
    name: '/clima',
    execute: async (msg, args) => {
        if (args.length === 0) return msg.reply('❌ Informe uma cidade. Ex: `/clima Curitiba`');

        const city = args.join(' ');
        try {
            const response = await axios.get(`https://api.hgbrasil.com/weather?key=cf604018&city_name=${encodeURIComponent(city)}`);
            const data = response.data.results;

            if (!data || data.city === 'São Paulo' && city.toLowerCase() !== 'são paulo' && city.toLowerCase() !== 'sao paulo') {
                return msg.reply(`❌ Não consegui encontrar dados precisos para *${city}*. Tente informar a cidade e o estado (Ex: \`/clima Rio de Janeiro,RJ\`).`);
            }

            const weatherMsg = `🌤️ *Clima em ${data.city}*\n\n` +
                `🌡️ *Temperatura:* ${data.temp}°C\n` +
                `☁️ *Condição:* ${data.description}\n` +
                `💧 *Umidade:* ${data.humidity}%\n` +
                `💨 *Vento:* ${data.wind_speedy}\n\n` +
                `🕒 _Atualizado às ${data.time}_`;

            await msg.reply(weatherMsg);
        } catch (error) {
            console.error('[Clima] Erro:', error.message);
            await msg.reply('❌ Erro na consulta de clima. Verifique a conexão ou tente novamente mais tarde.');
        }
    }
};
