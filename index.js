import makeWASocket, { 
  useMultiFileAuthState, 
  DisconnectReason,
  fetchLatestBaileysVersion,
  Browsers 
} from '@whiskeysockets/baileys';
import pino from 'pino';
import QRCode from 'qrcode-terminal';
import dotenv from 'dotenv';

dotenv.config();

async function connect() {
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  
  const sock = makeWASocket({
    version: (await fetchLatestBaileysVersion()).version,
    auth: state,
    printQRInTerminal: false,
    browser: Browsers.macOS('Desktop'),
    logger: pino({ level: 'silent' }),
    markOnlineOnConnect: true
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      QRCode.generate(qr, { small: true });
      console.log('📱 Scan QR Code with WhatsApp');
    }

    if (connection === 'open') {
      console.log('✅ Connected successfully!');
      console.log(`🤖 Bot: ${sock.user.name} (@${sock.user.id.split(':')[0]})`);
    }

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 
        DisconnectReason.loggedOut;
      
      if (shouldReconnect) {
        console.log('🔄 Reconnecting...');
        await connect();
      } else {
        console.log('❌ Logged out, please restart');
      }
    }
  });

  // Handle incoming messages
  sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0];
    if (!msg.message) return;
    if (msg.key.fromMe) return;
    
    const text = msg.message.conversation || 
                 msg.message.extendedTextMessage?.text || '';
    
    console.log(`📨 ${msg.pushName}: ${text}`);
  });

  return sock;
}

connect().catch(console.error);