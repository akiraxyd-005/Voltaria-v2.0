module.exports = {
    name: 'inspect',
    aliases: ['dump'],
    category: 'debug',
    description: 'Inspect message object (owner only)',
    usage: '§inspect',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        const inspectData = {
            chatId: extra.from,
            sender: extra.sender,
            messageType: msg.message ? Object.keys(msg.message)[0] : 'Unknown',
            timestamp: new Date().toISOString(),
            hasQuoted: !!msg.message?.extendedTextMessage?.contextInfo?.quotedMessage,
            mentionedUsers: msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || []
        };
        
        await extra.reply(`🔍 *Message Inspection*\n\n\`\`\`json\n${JSON.stringify(inspectData, null, 2)}\n\`\`\`\n\n> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`);
    }
};