const fs = require('fs');
const activeGamesPath = './database/activegames.json';

const riddles = [
    { question: "What has keys but can't open locks?", options: ["Piano", "Keyboard", "Map", "Door"], answer: "Piano" },
    { question: "What has a face and two hands but no arms?", options: ["Clock", "Watch", "Calendar", "Mirror"], answer: "Clock" }
];

module.exports = {
    name: 'riddle',
    category: 'games',
    description: 'Start Riddle Game',
    usage: '§riddle',
    isGroup: true,
    async execute(sock, msg, args, extra) {
        let activeGames = {};
        if (fs.existsSync(activeGamesPath)) activeGames = JSON.parse(fs.readFileSync(activeGamesPath));
        
        if (activeGames[extra.from]?.riddle) {
            return extra.reply('⚠️ A game is already running.');
        }
        
        activeGames[extra.from] = {
            riddle: {
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
┃  🤔  𝗥𝗜𝗗𝗗𝗟𝗘 𝗚𝗔𝗠𝗘
┗━━━━━━━━━━━━━━━━━━━━━━┛

  📏 8 rounds  •  🟡 Medium
  ⏱ 30s per riddle
  🔤 Answer with A / B / C / D

  ━━━━━━━━━━━━━━━━━━
  🎮 Type  join  to play
  ⏳ Starting in 45s...`);
    }
};