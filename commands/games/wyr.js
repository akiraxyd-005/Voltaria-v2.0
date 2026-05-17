const fs = require('fs');
const activeGamesPath = './database/activegames.json';

const wyrQuestions = [
    { text: "Would you rather be able to fly or be invisible?" },
    { text: "Would you rather travel 100 years into the past or 100 years into the future?" }
];

module.exports = {
    name: 'wyr',
    category: 'games',
    description: 'Would You Rather party game',
    usage: '§wyr',
    isGroup: true,
    async execute(sock, msg, args, extra) {
        let activeGames = {};
        if (fs.existsSync(activeGamesPath)) activeGames = JSON.parse(fs.readFileSync(activeGamesPath));
        
        if (activeGames[extra.from]?.wyr) {
            return extra.reply('⚠️ A game is already running.');
        }
        
        const isAdult = args.includes('18+');
        const rounds = parseInt(args[0]) || 10;
        
        activeGames[extra.from] = {
            wyr: {
                status: 'waiting',
                players: [],
                startTime: Date.now(),
                joinDeadline: Date.now() + 30000,
                rounds: rounds,
                isAdult: isAdult,
                round: 0,
                currentQuestion: null
            }
        };
        
        fs.writeFileSync(activeGamesPath, JSON.stringify(activeGames, null, 2));
        
        await sock.sendMessage(extra.from, {
            text: `┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🤷 𝗪𝗢𝗨𝗟𝗗 𝗬𝗢𝗨 𝗥𝗔𝗧𝗛𝗘𝗥
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

@${extra.sender.split('@')[0]} started the game!

💬 Type *join* to enter (30s)
🛑 Type *endwyr* to end anytime

🎯 *${rounds} rounds*
${isAdult ? '🔞 *Adult Mode* 🔞' : ''}

👥 Players: ${activeGames[extra.from].wyr.players.length}`,
            mentions: [extra.sender]
        }, { quoted: msg });
        
        setTimeout(async () => {
            const game = activeGames[extra.from]?.wyr;
            if (game && game.status === 'waiting' && game.players.length < 2) {
                await extra.reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🤷 𝗪𝗢𝗨𝗟𝗗 𝗬𝗢𝗨 𝗥𝗔𝗧𝗛𝗘𝗥
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ Not enough players joined!
Only ${game.players.length}/2 players. Game cancelled.

_Start again with §wyr_`);
                delete activeGames[extra.from]?.wyr;
                fs.writeFileSync(activeGamesPath, JSON.stringify(activeGames, null, 2));
            }
        }, 30000);
    }
};