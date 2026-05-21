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
const qrcode = require('qrcode-terminal');
const config = require('./config');
const handler = require('./handler');

const commandHandler = require('./handlers/command-handler');
const messageHandler = require('./handlers/message-handler');

const app = express();
const PORT = process.env.PORT || 5000;

let latestQR = null;
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

app.get('/', async (req, res) => {
    if (isConnected) {
        res.send('<h1>✅ Voltaria Bot is Online!</h1>');
    } else if (latestQR) {
        const QRCode = require('qrcode');
        const qrImage = await QRCode.toDataURL(latestQR);
        res.send(`
            <html>
                <head><title>Voltaria Nexus - QR Code</title></head>
                <body style="text-align:center;background:#0a0a0a;color:white;font-family:Arial">
                    <h2>⚡ Voltaria Nexus</h2>
                    <img src="${qrImage}" style="width:300px;border-radius:10px"/>
                    <p>Scan this QR with WhatsApp</p>
                    <p>Settings → Linked Devices → Link a Device</p>
                </body>
            </html>
        `);
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
            console.log('\n📱 QR CODE GENERATED');
            console.log(`🔗 Web view: https://${process.env.RAILWAY_STATIC_URL || 'localhost'}/`);
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

    // PAIRING CODE FOR RAILWAY (BEST SOLUTION)
    const pairingNumber = process.env.PAIRING_NUMBER;
    if (pairingNumber && !state.creds.registered) {
        setTimeout(async () => {
            try {
                const code = await sock.requestPairingCode(pairingNumber);
                console.log(`\n✅ PAIRING CODE: ${code}\n`);
                console.log(`📱 Go to WhatsApp → Settings → Linked Devices → Link with phone number`);
                console.log(`🔢 Enter this code: ${code}\n`);
            } catch (err) {
                console.error('Pairing code error:', err.message);
            }
        }, 2000);
    }

    sock.ev.on('creds.update', saveCreds);
    
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        for (const msg of messages) {
            if (!msg.message) continue;
            if (msg.key.remoteJid === 'status@broadcast') continue;
            if (msg.key.fromMe && !msg.message?.conversation?.startsWith(prefix)) continue;

            try {
                await messageHandler(sock, msg, commandHandler, prefix, botName);
            } catch (err) {
                console.error('Handler error:', err.message);
            }
        }
    });

    return sock;
}

process.on('SIGINT', async () => {
    console.log('🛑 Bot shutting down...');
    process.exit(0);
});

console.log('\n🚀 Starting Voltaria Bot...\n');
startBot().catch(console.error);