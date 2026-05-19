const { v4: uuidv4 } = require('uuid');

module.exports = {
    name: 'uuid',
    aliases: ['generateuuid', 'guid'],
    category: 'tools',
    description: 'Generate a random UUID',
    usage: '§uuid',
    async execute(sock, msg, args, extra) {
        const uuid = uuidv4();
        
        await extra.reply(`🔑 *Generated UUID*\n\n${uuid}\n\n> ©POWERED BY NEXUS`);
    }
};