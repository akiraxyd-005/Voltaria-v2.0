module.exports = {
    prefix: process.env.PREFIX || '§',
    botName: process.env.BOT_NAME || 'Voltaria Nexus',
    ownerNumber: (process.env.OWNER_NUMBER || '254108720384').split(','),
    sessionName: 'session',
    mongodbUrl: process.env.MONGODB_URL || '',
    timezone: 'Africa/Nairobi',
    packName: 'Voltaria',
    authorName: 'Nexus',
    stickerPack: 'Voltaria Nexus',
    apiKeys: {
        gemini: process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY',
        openai: process.env.OPENAI_API_KEY || '',
        weather: process.env.WEATHER_API_KEY || 'YOUR_WEATHER_API_KEY',
        spotify: {
            clientId: process.env.SPOTIFY_CLIENT_ID || '',
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET || ''
        }
    }
};
