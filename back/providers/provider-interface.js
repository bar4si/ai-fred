/**
 * @interface BotProvider
 * 
 * Este arquivo serve como documentação do "Contrato" que qualquer provedor
 * de WhatsApp deve seguir para ser compatível com o AI-Fred.
 * 
 * Um provedor deve obrigatoriamente:
 * 1. Emitir eventos padronizados (qr, authenticated, ready, message).
 * 2. Possuir métodos de ciclo de vida (initialize, destroy).
 */

/*
Eventos Esperados:
- 'qr': (qrCodeString) -> Quando um novo QR Code é gerado.
- 'authenticated': () -> Quando a sessão é vinculada com sucesso.
- 'loading_screen': (percent) -> Progresso de carregamento.
- 'ready': () -> Quando o provedor está pronto para enviar/receber.
- 'disconnected': () -> Quando a conexão é perdida.
- 'message': (msg) -> Quando uma nova mensagem é criada/recebida.
*/

/**
 * Exemplo de estrutura de um Provedor:
 * 
 * class MyProvider {
 *    constructor(botId) { ... }
 *    initialize() { ... }
 *    destroy() { ... }
 *    // O provedor deve ser um EventEmitter
 * }
 */

module.exports = {}; // Apenas para fins de documentação e referência
