const config = require('./config');
const { loadCommands } = require('./utils/commandLoader');
const { handleAFK } = require('./utils/afkHandler');

const commands = loadCommands();
console.log(`✅ Loaded ${commands.size} commands`);

const handleMessage = async (sock, msg) => {
    try {
        await handleAFK(sock, msg);
        
        let body = '';
        const content = msg.message;
        if (content?.conversation) body = content.conversation;
        else if (content?.extendedTextMessage?.text) body = content.extendedTextMessage.text;
        else return;
        
        if (!body) return;
        if (!body.startsWith(config.prefix)) return;
        
        const args = body.slice(config.prefix.length).trim().split(/ +/);
        const cmdName = args.shift().toLowerCase();
        
        const command = commands.get(cmdName);
        if (!command) return;
        
        const extra = {
            from: msg.key.remoteJid,
            sender: msg.key.participant || msg.key.remoteJid,
            reply: (text) => sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg }),
            react: (emoji) => sock.sendMessage(msg.key.remoteJid, { react: { text: emoji, key: msg.key } })
        };
        
        await command.execute(sock, msg, args, extra);
    } catch (err) {
        console.error('Handler error:', err.message);
    }
};

module.exports = { handleMessage };