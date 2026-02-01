# 🚀 Guia de Deploy: AI-Fred em VPS (Linux)

Este guia cobre a instalação do AI-Fred em um servidor Linux (Ubuntu/Debian), garantindo que o bot rode 24/7 com persistência e segurança.

---

## 1. Preparação do Servidor (Dependencies)
Como o AI-Fred usa o Puppeteer, precisamos instalar as bibliotecas do sistema necessárias para rodar o Chromium no Linux:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 \
libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 \
libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 \
libxss1 libxtst6 ca-certificates fonts-liberation libnss3 lsb-release xdg-utils wget
```

---

## 2. Instalação do Node.js
Recomendamos o uso do **NVM** para gerenciar a versão do Node:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
```

---

## 3. Configuração do Projeto
Clone seu repositório e instale as dependências:

```bash
git clone [URL_DO_SEU_REPO]
cd ai-fred/back
npm install
```

**Importante:** Crie e configure o seu arquivo `.env` no servidor com as chaves reais.

---

## 4. Gestão de Processo com PM2
O **PM2** garante que o bot reinicie automaticamente se houver uma falha ou se o servidor for reiniciado.

### Instalação:
```bash
npm install -g pm2
```

### Iniciar o Bot:
Dentro da pasta `back/`:
```bash
pm2 start src/index.js --name "ai-fred-back"
```

### Comandos Úteis do PM2:
- `pm2 logs`: Ver logs em tempo real.
- `pm2 status`: Ver se o bot está online.
- `pm2 restart ai-fred-back`: Reiniciar o bot.
- `pm2 save`: Salva a lista de processos para o próximo reboot.
- `pm2 startup`: Gera o script de auto-start do sistema.

---

## 5. Firewall e Portas (Oracle Cloud/AWS)
Se você estiver usando Oracle Cloud, AWS ou Google Cloud, você **DEVE** liberar a porta da API no painel do provedor:

1. Acesse o painel de **Ingress Rules** (Rede).
2. Libere a porta `3000` (TCP) para o IP `0.0.0.0/0`.
3. No Linux, libere também no `ufw`:
   ```bash
   sudo ufw allow 3000/tcp
   ```

---

## 6. Acesso via HTTPS (Opcional - Recomendado)
Para usar HTTPS, recomendamos o **Caddy Server** por ser o mais simples:

### Instalar Caddy:
```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

### Caddyfile (Configuração):
Crie um arquivo chamado `Caddyfile` e coloque:
```
seu-dominio.com {
    reverse_proxy localhost:3000
}
```
Depois rode `sudo systemctl reload caddy`. O Caddy cuidará do SSL (HTTPS) automaticamente para você!

---

## 7. CLI no Servidor
Você pode rodar o CLI em uma janela separada do terminal ou localmente no seu PC apontando para o IP do servidor no arquivo `cli-fred/.env`.
