cat > config.example.js << 'EOF'
module.exports = {
    prefix: '§',
    botName: 'Voltaria Nexus',
    ownerNumber: ['YOUR_NUMBER_HERE'],
    sessionName: 'session',
    mongodbUrl: '',
    timezone: 'Africa/Nairobi',
    packName: 'Voltaria',
    authorName: 'Nexus',
    stickerPack: 'Voltaria Nexus',
    apiKeys: {
        gemini: 'YOUR_GEMINI_API_KEY',
        openai: '',
        weather: 'YOUR_WEATHER_API_KEY',
        spotify: {
            clientId: '',
            clientSecret: ''
        }
    }
};
EOF