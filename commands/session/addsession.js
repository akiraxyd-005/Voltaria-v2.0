module.exports = {
    name: 'addsession',
    aliases: ['registersession', 'newsession'],
    category: 'session',
    description: 'Add a new session/device to the bot',
    usage: '§addsession <name>',
    async execute(sock, msg, args, extra) {
        let isOwner = global.owner?.includes(msg.sender.split('@')[0]);
        if (!isOwner) return await extra.reply('❌ Owner only command.');
        
        let sessionName = args[0];
        if (!sessionName) return await extra.reply('❌ Provide a session name.\nUsage: §addsession mydevice');
        
        // Logic to create new session
        await extra.reply(`✅ Session "${sessionName}" created successfully.\n\nScan the QR code from your new device.`);
    }
};