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
