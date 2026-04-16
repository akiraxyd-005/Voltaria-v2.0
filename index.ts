import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import Pino from 'pino';
import { config, connectDB, formatCurrency } from './config.js';
import { EconomyEngine } from './lib/economy.js';
import { User } from './lib/database.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const commands = new Map();

async function loadCommands() {
  const pluginsPath = path.join(__dirname, 'plugins/economy');
  if (fs.existsSync(pluginsPath)) {
    const files = fs.readdirSync(pluginsPath).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
    for (const file of files) {
      const module = await import(`./plugins/economy/${file}`);
      const command = module.default;
      if (command?.aliases) {
        for (const alias of command.aliases) {
          commands.set(alias, command);
        }
      }
    }
  }
  console.log(`✅ Loaded ${commands.size} commands`);
}

async function startBot() {
  await connectDB();
  await loadCommands();
  
  const { state, saveCreds } = await useMultiFileAuthState('session');
  
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger: Pino({ level: 'silent' }),
    browser: ['Voltaria Nexus', 'Chrome', '1.0.0']
  });
  
  console.log('\n╔════════════════════════════════════════╗');
  console.log(`║     ✦⚡ ${config.botName} ⚡✦     ║`);
  console.log('╠════════════════════════════════════════╣');
  console.log('║         WhatsApp Bot Starting...       ║');
  console.log('╚════════════════════════════════════════╝\n');
  console.log('📱 Scan the QR code with WhatsApp');
  console.log('📍 Settings > Linked Devices > Link a Device\n');
  
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        console.log('🔄 Reconnecting...');
        startBot();
      } else {
        console.log('❌ Logged out');
      }
    } else if (connection === 'open') {
      console.log('✅ Bot Connected!\n');
      console.log(`📱 Bot: ${config.botName}`);
      console.log(`👤 Owner: ${config.ownerName}`);
      console.log(`💰 Currency: ${config.currency.fullSymbol}\n`);
      
      await sock.sendMessage(`${config.ownerNumber}@s.whatsapp.net`, { 
        text: `✨ *${config.botName} is online!* ✨\n\n⚡ Ready to serve!` 
      });
    }
  });
  
  sock.ev.on('creds.update', saveCreds);
  
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;
    
    const jid = msg.key.remoteJid;
    const sender = msg.key.participant || jid;
    const messageText = msg.message?.conversation || 
                        msg.message?.extendedTextMessage?.text || '';
    
    // Add XP for messages
    if (!jid?.includes('g.us')) {
      const xpGain = Math.floor(Math.random() * 16) + 10;
      const result = await EconomyEngine.addXP(sender, xpGain);
      
      if (result.leveledUp) {
        await sock.sendMessage(sender, { 
          text: `🎉 *LEVEL UP!* 🎉\n\nLevel ${result.newLevel}!\n💰 +${formatCurrency(result.reward)}!`
        });
      }
    }
    
    // Handle commands
    if (messageText.startsWith(config.botPrefix)) {
      const args = messageText.slice(config.botPrefix.length).trim().split(/\s+/);
      const commandName = args[0].toLowerCase();
      const commandArgs = args.slice(1);
      const fullArgs = args.slice(1).join(' ');
      
      const command = commands.get(commandName);
      
      if (command) {
        const user = await User.findOne({ jid: sender });
        if (user) {
          user.commandsUsed++;
          await user.save();
        }
        
        try {
          await command.callback({
            client: sock,
            msg,
            args: commandArgs,
            fullArgs,
            command: commandName,
            prefix: config.botPrefix,
            sender,
            jid
          });
        } catch (error) {
          console.error(`Error in ${commandName}:`, error);
          await sock.sendMessage(sender, { text: '❌ Command failed!' });
        }
      }
    }
  });
}

startBot().catch(console.error);