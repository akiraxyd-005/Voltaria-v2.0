const moment = require('moment-timezone');

module.exports = {
    name: 'time',
    aliases: ['currenttime', 'clock'],
    category: 'tools',
    description: 'Get current time in different timezones',
    usage: '§time <timezone>',
    async execute(sock, msg, args, extra) {
        const tz = args[0] || 'Africa/Nairobi';
        
        const timezones = {
            'kenya': 'Africa/Nairobi',
            'ny': 'America/New_York',
            'london': 'Europe/London',
            'tokyo': 'Asia/Tokyo',
            'dubai': 'Asia/Dubai',
            'india': 'Asia/Kolkata'
        };
        
        const timezone = timezones[tz?.toLowerCase()] || tz;
        
        if (!moment.tz.zone(timezone)) {
            return extra.reply(`❌ Invalid timezone. Examples: Kenya, NY, London, Tokyo, Dubai, India\n\n> ©POWERED BY NEXUS`);
        }
        
        const currentTime = moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss');
        
        await extra.reply(`🕐 *Time in ${tz.toUpperCase()}*\n\n${currentTime}\n\n> ©POWERED BY NEXUS`);
    }
};