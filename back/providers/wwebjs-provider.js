const { Client, LocalAuth } = require('whatsapp-web.js');
const EventEmitter = require('events');

/**
 * WWebJSProvider
 * 
 * Implementação do provedor de WhatsApp utilizando a biblioteca whatsapp-web.js.
 * Esta classe encapsula a complexidade do Puppeteer e emite eventos padronizados
 * que o BotManager espera.
 */
class WWebJSProvider extends EventEmitter {
    /**
     * @param {string} botId Identificador único da sessão.
     */
    constructor(botId) {
        super();
        this.botId = botId;
        this.client = new Client({
            authStrategy: new LocalAuth({ clientId: botId }),
            puppeteer: {
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            }
        });

        this._setupEventListeners();
    }

    /**
     * Mapeia os eventos nativos do whatsapp-web.js para os eventos
     * contratuais do AI-Fred.
     * @private
     */
    _setupEventListeners() {
        this.client.on('qr', (qr) => this.emit('qr', qr));
        this.client.on('authenticated', () => this.emit('authenticated'));
        this.client.on('loading_screen', (percent) => this.emit('loading_screen', percent));
        this.client.on('ready', () => this.emit('ready'));
        this.client.on('disconnected', () => this.emit('disconnected'));

        // Padronizamos 'message_create' para 'message' para simplificar a interface
        this.client.on('message_create', (msg) => this.emit('message', msg));
    }

    /**
     * Retorna informações sobre o bot conectado.
     */
    getInfo() {
        return this.client.info;
    }

    /**
     * Estima o uso de memória do bot em bytes.
     * Como o Puppeteer é externo e o objeto Client é circular, usamos
     * uma métrica baseada no heapUsed do processo dividida pelos bots ativos
     * ou um valor base estimado.
     */
    getMemoryUsage() {
        // Retorna um valor base estimado do nó para a instância + metadados.
        // O grosso da memória (Chromium) não é capturável facilmente sem pidusage.
        const baseMemory = 15 * 1024 * 1024; // 15MB estimativo de overhead do Node por bot
        return baseMemory + (this.botId.length * 1024);
    }

    /**
     * Inicializa o cliente do WhatsApp.
     */
    async initialize() {
        return this.client.initialize();
    }

    /**
     * Encerra a sessão e limpa recursos.
     */
    async destroy() {
        return this.client.destroy();
    }
}

module.exports = WWebJSProvider;
