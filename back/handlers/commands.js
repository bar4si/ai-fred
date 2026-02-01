const fs = require('fs');
const path = require('path');
const { simulateTyping, delay } = require('../utils/humanizer');

/**
 * Maestro de Comandos (Dispatcher)
 */

const commands = {};
const keywords = {}; // Registro para gatilhos sem prefixo '/'
const commandsPath = path.join(__dirname, 'commands');

// Carregar comandos dinamicamente
if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));
        if (command.name && command.execute) {
            const cmdName = command.name.toLowerCase();

            if (command.isKeyword) {
                keywords[cmdName] = command.execute;
            } else {
                commands[cmdName] = command.execute;
            }
        }
    }
    console.log(`📦 [Dispatcher] ${Object.keys(commands).length} comandos e ${Object.keys(keywords).length} palavras-chave carregados.`);
}

/**
 * Analisa e executa um comando ou palavra-chave.
 * @param {object} msg 
 */
async function handleCommand(msg) {
    const body = msg.body.trim().toLowerCase();

    // 1. Verificar Comandos com Prefixos (/)
    if (msg.body.startsWith('/')) {
        const [cmd, ...args] = msg.body.trim().split(/\s+/);
        const executeFn = commands[cmd.toLowerCase()];
        if (executeFn) {
            await delay(500, 1500);
            await simulateTyping(msg, 2000);
            await executeFn(msg, args);
            return true;
        }
    }

    // 2. Verificar Palavras-chave (Sem prefixo)
    const keywordFn = keywords[body];
    if (keywordFn) {
        await delay(500, 1500);
        await simulateTyping(msg, 1500);
        await keywordFn(msg);
        return true;
    }

    return false;
}

module.exports = { handleCommand };
