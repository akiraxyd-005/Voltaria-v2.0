const fs = require('fs');
const axios = require('axios');
const activeGamesPath = './database/activegames.json';

module.exports = {
    name: 'trivia',
    category: 'games',
    description: 'Start Trivia Game (easy/medium/hard)',
    usage: '§trivia',
    isGroup: true,
    async execute(sock, msg, args, extra) {
        let activeGames = {};
        if (fs.existsSync(activeGamesPath)) activeGames = JSON.parse(fs.readFileSync(activeGamesPath));
        
        if (activeGames[extra.from]?.trivia) {
            return extra.reply('⚠️ A game is already running.');
        }
        
        activeGames[extra.from] = {
            trivia: {
                status: 'waiting',
                players: [],
                startTime: Date.now(),
                joinDeadline: Date.now() + 45000,
                round: 0,
                scores: {}
            }
        };
        
        fs.writeFileSync(activeGamesPath, JSON.stringify(activeGames, null, 2));
        
        await extra.reply(`┏━━━━━━━━━━━━━━━━━━━━━━┓
┃  🧠  𝗧𝗥𝗜𝗩𝗜𝗔  𝗖𝗛𝗔𝗟𝗟𝗘𝗡𝗚𝗘
┗━━━━━━━━━━━━━━━━━━━━━━┛

  📏 10 rounds  •  🟡 Medium
  ⏱ 20s per question

  ━━━━━━━━━━━━━━━━━━
  🎮 Type  join  to play
  ⏳ Starting in 45s...`);
    }
};