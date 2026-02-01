# 📝 Lista de Tarefas (To-Do) - AI-Fred

Este arquivo rastreia o progresso técnico do bot AI-Fred.

---

## 🚀 Próximos Passos (Setup)
- [x] **1.** Definir a linguagem final (Node.js).
- [x] **2.** Configurar o ambiente de desenvolvimento (Setup NPM/Git).
- [x] **3.** Realizar o primeiro "Hello World" (Envio de mensagem simples).

---

## 🏁 Fase 1: Fundação
> [!IMPORTANT]
> Garantir autonomia e autenticação.
- [x] Inicialização do repositório Node.js.
- [x] Implementação do sistema de QR Code para autenticação persistente.
- [x] Configuração do banco de dados SQLite inicial.

---

## ✉️ Fase 2: Integração de Mensagens & APIs
- [x] Listener de eventos de mensagens (`message_create`).
- [x] Sistema de parse para comandos básicos (ex: `/clima`, `/resumo`).
- [x] **Integração com APIs Externas:** Uso de serviços como HG Brasil para dados em tempo real no comando `/clima`.
- [x] Registro (Log) de interações no banco de dados.

### 🌟 10 Ideias Inovadoras para Implementar:
1.  **📦 Rastreador Proativo:** Monitorar códigos de rastreio e avisar sobre mudanças de status automaticamente.
2.  **🎭 Criador de Stickers:** Converter qualquer imagem enviada em figurinha (sticker) instantaneamente. [Concluído]
3.  **🎥 Media Downloader:** `/dl [link]` para baixar vídeos/áudios do YouTube, TikTok ou Instagram.
4.  **🕵️ Monitor de Preços:** Avisar o usuário quando um produto em um site específico atingir um preço alvo.
5.  **📝 Transcritor de Lembretes:** `/nota [texto]` que salva lembretes com data e avisa no horário marcado.
6.  **🖼️ WebShot:** `/print [url]` que envia uma captura de tela (screenshot) de um site em tempo real.
7.  **🎵 Letras & Infos:** `/musica [nome]` para buscar letras e links de streaming via API.
8.  **🛒 Lista de Compras Compartilhada:** Comando para adicionar/remover itens de uma lista persistente.
9.  **🎲 Sorteador Avançado:** `/sorteio "Item 1, Item 2, Item 3"` para escolher um vencedor aleatoriamente.
10. **🛡️ Gerador de Identidade:** `/fake` para gerar dados de teste (nome, CPF fictício, endereço) para desenvolvedores.
11. **🎓 Assistente Educacional:** Fluxo de criação e coleta interativa de questionários para alunos, com salvamento automático de respostas. [Em andamento]
12. **🧠 Banco de Conhecimento RAG:** Permitir que o bot aprenda com PDFs ou documentos enviados para responder dúvidas específicas.
13. **📅 Agendador de Postagens/Status:** Comando para programar mensagens que o bot deve postar no Status ou enviar para grupos em horários específicos.
14. **🎙️ Voice-to-Command:** Comando que entende áudios curtos para executar tarefas (ex: mandar um áudio "Fred, figurinha").
15. **🛡️ Anti-Scam:** Analisador de links recebidos para alertar sobre possíveis phishings ou golpes conhecidos.
16. **📊 Dashboard Web Real-time:** Uma interface web moderna (Next.js) para visualizar logs e status graficamente.

---

## 🎮 Ideias de Jogos (Gaming)
1.  **❓ Trivia/Quiz:** Desafios de perguntas e respostas em grupos com ranking de pontos.
2.  **🪓 Forca (Hangman):** O clássico jogo da forca adaptado para o chat.
3.  **❌ Jogo da Velha (Tic-Tac-Toe):** Partidas rápidas entre usuários ou contra o bot.
4.  **🎭 RPG Narrativo com IA:** O Fred atua como Mestre de RPG, criando uma história dinâmica baseada nas escolhas do usuário.
5.  **🧩 Palavra do Dia (Estilo Termo):** Um desafio diário onde todos os usuários tentam adivinhar a mesma palavra.
6.  **🕵️ "Quem sou eu?":** A IA assume a persona de um personagem famoso e os usuários precisam adivinhar com perguntas de sim/não.

---

---

## 🧠 Fase 3: Inteligência Artificial
- [x] Integração com a API do Google Gemini (`gemini-1.5-flash`).
- [x] Comando `/fred` para interação em linguagem natural.
- [x] Tratamento de erros de API (Trimming de modelo e validação de chaves).
- [ ] Implementação de memória de longo prazo por contato.

---

## 🚀 Fase 4: Recursos Avançados & Controle
- [x] **API REST Integrada:** Servidor Express para controle remoto dos bots.
- [x] **Cliente Console (CLI):** Interface interativa para monitoramento e gestão.
- [x] **Multi-Bot:** Suporte completo para múltiplas sessões simultâneas.
- [x] **Segurança:** Implementação de `API_KEY` para comunicação backend/CLI.
- [x] **Suporte a Áudio:** Sistema de transcrição automática de voz (ajustável por comando).
- [x] **Gestão Remota:** Criação de sessões e visualização de QR Code direto pelo CLI.
- [ ] Empacotamento via Docker.
- [ ] Interface Web (Frontend) completa.
