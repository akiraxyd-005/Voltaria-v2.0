const axios = require('axios');

module.exports = {
    name: 'ip',
    aliases: ['ipinfo', 'myip'],
    category: 'tools',
    description: 'Get IP information',
    usage: '§ip <ip address (optional)>',
    async execute(sock, msg, args, extra) {
        const ip = args[0];
        
        await extra.reply(`🌐 *Fetching IP info...*`);
        
        try {
            let url = 'https://ipapi.co/json/';
            if (ip) url = `https://ipapi.co/${ip}/json/`;
            
            const response = await axios.get(url);
            const data = response.data;
            
            if (data.error) {
                return extra.reply(`❌ Invalid IP address.\n\n> ©POWERED BY NEXUS`);
            }
            
            await extra.reply(`🌐 *IP Information*\n\n📡 *IP:* ${data.ip}\n📍 *Location:* ${data.city}, ${data.region}, ${data.country_name}\n🌍 *Coordinates:* ${data.latitude}, ${data.longitude}\n🏢 *ISP:* ${data.org}\n\n> ©POWERED BY NEXUS`);
        } catch (error) {
            await extra.reply(`❌ IP lookup failed.\n\n> ©POWERED BY NEXUS`);
        }
    }
};