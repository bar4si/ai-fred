# 🤖 AI-Fred: Motor de Multi-Bots Concorrentes

O AI-Fred é um motor de automação de WhatsApp de nível profissional, projetado para orquestrar **múltiplas contas simultaneamente**. Desenvolvido com uma arquitetura modular de alto padrão, ele utiliza `whatsapp-web.js`, Node.js e Google Gemini para oferecer um centro de comando centralizado para comunicações de alta eficiência.

---

## 📑 Índice
1. [Visão Geral](#1-visão-geral)
2. [Stack Tecnológica](#2-stack-tecnológica)
3. [Arquitetura & Injeção de Dependência](#3-arquitetura--injeção-de-dependência)
4. [Núcleo Multi-Bot Concorrente](#4-núcleo-multi-bot-concorrente)
5. [API & Controle Remoto](#5-api--controle-remoto)
6. [Comandos & Exemplos de Uso](#6-comandos--exemplos-de-uso)
7. [Instalação & Configuração](#7-instalação--configuração)
8. [Roadmap Avançado](#8-roadmap-avançado)

---

## 1. Visão Geral
O **AI-Fred** é um assistente de nível profissional projetado para automação de WhatsApp de alta disponibilidade. Ele foca em estabilidade, gestão de múltiplas contas e integração fluida com IA, sendo ideal tanto para assistência pessoal quanto para fluxos de trabalho empresariais.

---

## 2. Stack Tecnológica
Desenvolvido com foco em modularidade e performance:
- **Runtime:** `Node.js (v18+)`
- **Provider:** `whatsapp-web.js` (Integração estável ao nível de navegador)
- **Banco de Dados:** `SQLite` (Persistência leve)
- **Inteligência:** `Google Gemini API` (NLP avançado e transcrição de áudio)

---

## 3. Arquitetura & Injeção de Dependência
O motor utiliza o padrão de **Injeção de Dependência** para permanecer agnóstico ao provedor. Comandos, handlers e até o provedor de WhatsApp (WWebJS vs. API Oficial) podem ser trocados ou estendidos sem modificar a lógica central.

---

## 4. Núcleo Multi-Bot Concorrente
O AI-Fred suporta **concorrência real**. Cada instância de bot roda em seu próprio processo Puppeteer, gerenciado por um `BotManager` central.
- **Isolamento:** As sessões são armazenadas em pastas independentes (`.wwebjs_auth/session-[id]`).
- **Dinamismo:** Adicione ou remova bots em tempo real via API ou CLI sem reiniciar o processo mestre.

---

## 5. API & Controle Remoto
O AI-Fred expõe uma **API REST Protegida** para controle externo e inclui um **Console Client** (CLI) dedicado.

- **API Server:** Inicia automaticamente na porta `3000`.
- **Autenticação:** Todas as requisições exigem o header `x-api-key`.
- **Endpoints:**
  - `GET /status`: Status em tempo real, estatísticas, estado de áudio e privacidade.
  - `GET /qr/:botId`: Obtém a string do QR Code para sessões pendentes.
  - `POST /create-bot`: Inicializa dinamicamente uma nova sessão (instância Puppeteer).
  - `POST /toggle-privacy`: Alterna entre modos Público e Privado.
  - `POST /send-message`: Envia mensagens manuais através de qualquer bot ativo.

---

## 6. Comandos & Exemplos de Uso
| Comando | Ação | Exemplo |
| :--- | :--- | :--- |
| `/ajuda` | Exibe o menu de comandos | `Usuário: /ajuda` |
| `/fred [pergunta]` | Interação direta com a IA (Gemini) | `Usuário: /fred como você está?` |
| `/audio [on/off]` | Ativa/desativa transcrição automática | `Usuário: /audio on` |
| `/status` | Métricas de conexão e por bot | `Usuário: /status` |
| `/sticker` | Converte imagem em figurinha | `(na legenda): /sticker` |

---

## 7. Instalação & Configuração
Tanto a pasta `back/` quanto a `cli-fred/` utilizam arquivos `.env` para configuração.

**Backend (.env):**
```env
GEMINI_API_KEY=sua_chave_aqui
GEMINI_MODEL=gemini-2.5-flash
API_KEY=fred_secret_key_2024
```

**Console Client (cli-fred/.env):**
```env
API_URL=http://localhost:3000
API_KEY=fred_secret_key_2024
```

Para iniciar o cliente de console:
```bash
cd cli-fred
node index.js
```

---

## 8. Roadmap Avançado
Além do motor principal, o AI-Fred evolui com utilitários de alta performance:

| Recurso | Descrição | Status |
| :--- | :--- | :--- |
| **Sticker Maker** | Conversão instantânea de imagem em figurinha | ✅ |
| **Inteligência de Áudio** | Transcrição em tempo real usando Gemini | ✅ |
| **API Protegida** | Controle remoto via Express com API Key | ✅ |
| **Painel CLI** | Console interativo de gestão multi-bot | ✅ |
| **Assistente Educacional** | Coleta interativa de questionários | ⏳ |
| **Media Downloader** | Download de vídeos de redes sociais | 📅 |
| **Resumos Dinâmicos** | Sumarização de chat via IA | 📅 |
| **WebShot** | Capturas de tela de sites em tempo real | 📅 |

---
