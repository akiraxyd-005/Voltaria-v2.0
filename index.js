process.env.PUPPETEER_SKIP_DOWNLOAD = 'true';
process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true';

const express = require('express');
const pino = require('pino');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  Browsers
} = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const config = require('./config');
const handler = require('./handler');

const app = express();
const PORT = process.env.PORT || 3000;

let latestQR = null;
let isConnected = false;

app.get('/', async (req, res) => {
    if (isConnected) {
        res.send('<h1>✅ Voltaria Bot is Online!</h1>');
    } else if (latestQR) {
        const QRCode = require('qrcode');
        const qrImage = await QRCode.toDataURL(latestQR);
        res.send(`<img src="${qrImage}" style="width:300px;"/>`);
    } else {
        res.send('<h1>🚀 Starting Voltaria Bot...</h1>');
    }
});

app.get('/health', (req, res) => res.status(200).send('OK'));
app.listen(PORT, () => console.log(`✅ Web server on port ${PORT}`));

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        auth: state,
        browser: Browsers.ubuntu('Chrome'),
        printQRInTerminal: false
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, qr, lastDisconnect } = update;

        if (qr) {
            latestQR = qr;
            isConnected = false;
            console.log('📱 QR Code generated!');
        }

        if (connection === 'open') {
            isConnected = true;
            latestQR = null;
            console.log('\n✅ Voltaria Bot Connected!');
            console.log(`📱 Bot: ${sock.user.id.split(':')[0]}`);
            console.log(`⚡ Prefix: ${config.prefix}\n`);
        }

        if (connection === 'close') {
            const code = lastDisconnect?.error?.output?.statusCode;
            if (code !== DisconnectReason.loggedOut) {
                setTimeout(startBot, 5000);
            }
        }
    });

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        for (const msg of messages) {
            if (!msg.message) continue;
            try {
                await handler.handleMessage(sock, msg);
            } catch (err) {
                console.error('Error:', err.message);
            }
        }
    });

    return sock;
}

console.log('\n🚀 Starting Voltaria Bot...\n');
startBot().catch(console.error);