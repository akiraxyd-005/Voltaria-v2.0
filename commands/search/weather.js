const axios = require('axios');

module.exports = {
    name: 'weather',
    aliases: ['temp', 'climate'],
    category: 'search',
    description: 'Check weather info',
    usage: '§weather <city>',
    async execute(sock, msg, args, extra) {
        const city = args.join(' ');
        
        if (!city) {
            return extra.reply(`❌ *Usage:* §weather <city>\n\nExample: §weather London`);
        }
        
        await extra.reply(`🌤️ *Getting weather for ${city}...*`);
        
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
                params: {
                    q: city,
                    appid: process.env.OPENWEATHER_API_KEY,
                    units: 'metric'
                }
            });
            
            const data = response.data;
            const weather = data.weather[0];
            const temp = data.main.temp;
            const feelsLike = data.main.feels_like;
            const humidity = data.main.humidity;
            const wind = data.wind.speed;
            
            const emoji = weather.main === 'Clear' ? '☀️' : weather.main === 'Clouds' ? '☁️' : weather.main === 'Rain' ? '🌧️' : weather.main === 'Snow' ? '❄️' : '🌤️';
            
            await extra.reply(`🌤️ *Weather in ${data.name}, ${data.sys.country}*\n\n${emoji} *Condition:* ${weather.description}\n🌡️ *Temperature:* ${temp}°C (feels like ${feelsLike}°C)\n💧 *Humidity:* ${humidity}%\n💨 *Wind:* ${wind} m/s\n\n> ©POWERED BY NEXUS`);
        } catch (error) {
            await extra.reply(`❌ City "${city}" not found.\n\n> ©POWERED BY NEXUS`);
        }
    }
};