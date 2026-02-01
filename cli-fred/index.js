const axios = require('axios');
const chalk = require('chalk');
const inquirer = require('inquirer');

const API_URL = 'http://localhost:3000';

/**
 * Função principal do Cliente Console.
 */
async function main() {
    console.clear();
    console.log(chalk.cyan('--------------------------------------------'));
    console.log(chalk.bold.white('      🚀 AI-FRED CONSOLE CLIENT 🚀         '));
    console.log(chalk.cyan('--------------------------------------------'));

    while (true) {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'O que deseja fazer?',
                choices: [
                    { name: '📊 Ver Status dos Bots', value: 'status' },
                    { name: '✉️  Enviar Mensagem Manual', value: 'send' },
                    { name: '❌ Sair', value: 'exit' }
                ]
            }
        ]);

        if (action === 'exit') break;

        try {
            if (action === 'status') {
                await showStatus();
            } else if (action === 'send') {
                await sendMessage();
            }
        } catch (err) {
            console.error(chalk.red('\n❌ Erro de conexão com a API:'), err.message);
        }

        console.log(chalk.cyan('\n--------------------------------------------'));
    }
}

async function showStatus() {
    const res = await axios.get(`${API_URL}/status`);
    const bots = res.data;

    if (bots.length === 0) {
        console.log(chalk.yellow('\nNenhum bot encontrado no momento.'));
        return;
    }

    console.log(chalk.bold.underline('\nStatus dos Bots:'));
    bots.forEach(bot => {
        let statusColor = bot.status.includes('Online') ? chalk.green : chalk.yellow;
        if (bot.status.includes('❌')) statusColor = chalk.red;

        const privacyLabel = bot.adminOnly ? chalk.red('[PRIVATE]') : chalk.cyan('[PUBLIC]');
        const audioLabel = bot.transcriptionEnabled ? chalk.magenta('[🎙️ ON]') : chalk.gray('[🎙️ OFF]');

        console.log(`${chalk.blue(`[${bot.id}]`)} ${statusColor(bot.status)} ${privacyLabel} ${audioLabel} | 📊 ${bot.contacts} ctt, ${bot.messages} msg`);
        if (bot.hasQr) {
            console.log(chalk.magenta(`   🔗 QR Code disponível em: ${API_URL}/qr/${bot.id}`));
        }
    });
}

async function sendMessage() {
    const statusRes = await axios.get(`${API_URL}/status`);
    const onlineBots = statusRes.data.filter(b => b.status === 'Online ✅');

    if (onlineBots.length === 0) {
        console.log(chalk.red('\nNão há bots online para enviar mensagens.'));
        return;
    }

    const { botId, to, message } = await inquirer.prompt([
        {
            type: 'list',
            name: 'botId',
            message: 'Escolha o bot:',
            choices: onlineBots.map(b => b.id)
        },
        {
            type: 'input',
            name: 'to',
            message: 'Telefone do destinatário (com DDD, ex: 5511999999999):',
            validate: input => input.length >= 10 || 'Telefone inválido'
        },
        {
            type: 'input',
            name: 'message',
            message: 'Mensagem:',
            validate: input => input.length > 0 || 'Mensagem não pode ser vazia'
        }
    ]);

    console.log(chalk.yellow('Enviando...'));
    const res = await axios.post(`${API_URL}/send-message`, { botId, to, message });

    if (res.data.success) {
        console.log(chalk.green('✅ Mensagem enviada com sucesso!'));
    } else {
        console.log(chalk.red('❌ Erro ao enviar:'), res.data.error);
    }
}

main().catch(err => {
    console.error(chalk.red('Erro Fatal no Cliente:'), err);
    process.exit(1);
});
