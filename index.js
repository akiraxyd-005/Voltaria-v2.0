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

// Load command handlers
const commandHandler = require('./handlers/command-handler');
const messageHandler = require('./handlers/message-handler');

const app = express();
const PORT = process.env.PORT || 5000;

let latestQR = null;
let isConnected = false;

// Settings
const prefix = config.prefix || '§';
const botName = config.botName || 'Voltaria Nexus';
const ownerNumber = config.ownerNumber || ['254108720384'];

// Global variables
global.owner = ownerNumber;
global.disabledGroups = [];
global.nsfwDisabledGroups = [];
global.reportCooldowns = {};
global.bannedReporters = [];
global.sudoUsers = [];

// Web server
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
        printQRInTerminal: false,
        generateHighQualityLinkPreview: true,
        patchMessageBeforeSending: (message) => {
            const requiresPatch = !!(
                message.buttonsMessage || 
                message.templateMessage || 
                message.listMessage
            );
            if (requiresPatch) {
                message = {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadataVersion: 2,
                                deviceListMetadata: {},
                            },
                            ...message,
                        },
                    },
                };
            }
            return message;
        }
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, qr, lastDisconnect } = update;

        if (qr) {
            latestQR = qr;
            isConnected = false;
            console.log('📱 QR Code generated!');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'open') {
            isConnected = true;
            latestQR = null;
            console.log('\n✅ Voltaria Bot Connected!');
            console.log(`📱 Bot: ${sock.user.id.split(':')[0]}`);
            console.log(`⚡ Prefix: ${prefix}`);
            console.log(`👑 Owner: ${ownerNumber[0]}\n`);
        }

        if (connection === 'close') {
            const code = lastDisconnect?.error?.output?.statusCode;
            if (code !== DisconnectReason.loggedOut) {
                console.log('🔄 Reconnecting...');
                setTimeout(startBot, 5000);
            } else {
                console.log('❌ Logged out. Please delete session folder and restart.');
            }
        }
    });

    sock.ev.on('creds.update', saveCreds);
    
    // Handle messages with both old and new handler systems
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        for (const msg of messages) {
            if (!msg.message || msg.key.fromMe) continue;
            
            // Ignore status messages
            if (msg.key.remoteJid === 'status@broadcast') continue;
            
            try {
                // Try new handler system first
                await messageHandler(sock, msg, commandHandler, prefix, botName);
            } catch (err) {
                console.error('New handler error:', err.message);
                // Fallback to old handler
                try {
                    await handler.handleMessage(sock, msg);
                } catch (err2) {
                    console.error('Old handler error:', err2.message);
                }
            }
        }
    });

    // Handle group updates
    sock.ev.on('group-participants.update', async (update) => {
        // Handle welcome/goodbye here if needed
    });

    // Handle presence updates
    sock.ev.on('presence.update', async (update) => {
        // Optional: track user presence
    });

    return sock;
}

// Handle process termination
process.on('SIGINT', async () => {
    console.log('🛑 Bot shutting down...');
    process.exit(0);
});

console.log('\n🚀 Starting Voltaria Bot...\n');
startBot().catch(console.error);