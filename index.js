process.env.PUPPETEER_SKIP_DOWNLOAD = 'true';
process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true';

const fs = require('fs');
if (!fs.existsSync('./temp')) fs.mkdirSync('./temp', { recursive: true });
if (!fs.existsSync('./lib')) fs.mkdirSync('./lib', { recursive: true });

const express = require('express');
const pino = require('pino');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  Browsers
} = require('@whiskeysockets/baileys');
const config = require('./config');

const commandHandler = require('./handlers/command-handler');
const messageHandler = require('./handlers/message-handler');

const app = express();
const PORT = process.env.PORT || 5000;

let isConnected = false;

const prefix = config.prefix || '§';
const botName = config.botName || 'Voltaria Nexus';
const ownerNumber = config.ownerNumber || ['254108720384'];

global.owner = ownerNumber;
global.disabledGroups = [];
global.nsfwDisabledGroups = [];
global.reportCooldowns = {};
global.bannedReporters = [];
global.sudoUsers = [];

// Web server
app.get('/', async (req, res) => {
    if (isConnected) {
        res.send('<h1>✅ Voltaria Bot is Online!</h1><p>Bot is connected and working.</p>');
    } else {
        res.send('<h1>🚀 Voltaria Bot Starting...</h1><p>Check logs for pairing code.</p>');
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
        printQRInTerminal: false,
        generateHighQualityLinkPreview: true
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'open') {
            isConnected = true;
            console.log('\n✅ Voltaria Bot Connected!');
            console.log(`📱 Bot: ${sock.user.id.split(':')[0]}`);
            console.log(`⚡ Prefix: ${prefix}`);
            console.log(`👑 Owner: ${ownerNumber[0]}\n`);
        }

        if (connection === 'close') {
            isConnected = false;
            const code = lastDisconnect?.error?.output?.statusCode;
            if (code !== DisconnectReason.loggedOut) {
                console.log('🔄 Reconnecting in 5 seconds...');
                setTimeout(startBot, 5000);
            } else {
                console.log('❌ Logged out. Please delete session folder and restart.');
            }
        }
    });

    // PAIRING CODE ONLY - NO QR
    const pairingNumber = process.env.PAIRING_NUMBER;
    if (pairingNumber) {
        setTimeout(async () => {
            try {
                console.log(`\n🔐 Requesting pairing code for ${pairingNumber}...`);
                const code = await sock.requestPairingCode(pairingNumber);
                console.log(`\n✅━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━✅`);
                console.log(`\n        🔢 YOUR PAIRING CODE: ${code}\n`);
                console.log(`📱 Open WhatsApp → Settings → Linked Devices → Link with phone number`);
                console.log(`🔑 Enter this code: ${code}\n`);
                console.log(`✅━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━✅\n`);
            } catch (err) {
                console.error('❌ Pairing failed:', err.message);
            }
        }, 2000);
    } else {
        console.log('\n⚠️ No PAIRING_NUMBER environment variable set!');
        console.log('Add PAIRING_NUMBER with your WhatsApp number (e.g., 2547xxxxxx)\n');
    }

    sock.ev.on('creds.update', saveCreds);
    
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        for (const msg of messages) {
            if (!msg.message) continue;
            if (msg.key.remoteJid === 'status@broadcast') continue;

            try {
                await messageHandler(sock, msg, commandHandler, prefix, botName);
            } catch (err) {
                console.error('Handler error:', err.message);
            }
        }
    });

    return sock;
}

console.log('\n🚀 Starting Voltaria Bot...\n');
console.log('📌 Using PAIRING CODE method (no QR needed)\n');

startBot().catch(console.error);