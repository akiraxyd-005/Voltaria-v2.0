const fs = require('fs');
const activeGamesPath = './database/activegames.json';

module.exports = {
    name: 'wcg',
    category: 'games',
    description: 'Start Word Connection Game',
    usage: '§wcg',
    isGroup: true,
    async execute(sock, msg, args, extra) {
        let activeGames = {};
        if (fs.existsSync(activeGamesPath)) activeGames = JSON.parse(fs.readFileSync(activeGamesPath));
        
        if (activeGames[extra.from]?.wcg) {
            return extra.reply('❌ A Word Connection Game is already active in this group!');
        }
        
        const words = ['apple', 'fruit', 'banana', 'yellow', 'sun', 'hot', 'cold', 'ice', 'water', 'drink'];
        const startWord = words[Math.floor(Math.random() * words.length)];
        
        activeGames[extra.from] = {
            wcg: {
                active: true,
                currentWord: startWord,
                lastLetter: startWord.slice(-1),
                players: [],
                startTime: Date.now()
            }
        };
        
        fs.writeFileSync(activeGamesPath, JSON.stringify(activeGames, null, 2));
        
        await extra.reply(`🎮 *WORD CONNECTION GAME STARTED!*\n\nStarting word: *${startWord}*\n\nNext word must start with the letter *"${startWord.slice(-1)}"*\n\nType any word starting with that letter to continue!\n\n⏱️ Game ends after 30 seconds of no response.`);
    }
};