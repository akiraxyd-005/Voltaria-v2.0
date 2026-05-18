module.exports = {
    name: 'test',
    category: 'debug',
    description: 'Debug full message object',
    usage: '§test',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        const debugInfo = `┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔍 *DEBUG INFO* 🔍
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

📱 *Chat ID:* ${extra.from}
👤 *Sender:* ${extra.sender}
🏷️ *Push Name:* ${msg.pushName || 'N/A'}
📝 *Message Type:* ${msg.message ? Object.keys(msg.message)[0] : 'Unknown'}
🕐 *Timestamp:* ${new Date().toLocaleString()}
⚡ *Prefix:* §
🔧 *Args:* ${args.length > 0 ? args.join(', ') : 'None'}

━━━━━━━━━━━━━━━━━━━━━━━━━━
> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`;
        
        await extra.reply(debugInfo);
        
        // Also log to console for deeper debugging
        console.log('[DEBUG] Full message:', JSON.stringify(msg, null, 2));
    }
};