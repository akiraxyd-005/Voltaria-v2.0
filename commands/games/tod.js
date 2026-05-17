const fs = require('fs');
const activeGamesPath = './database/activegames.json';

module.exports = {
    name: 'tod',
    category: 'games',
    description: 'Truth or Dare party game',
    usage: '§tod',
    isGroup: true,
    async execute(sock, msg, args, extra) {
        let activeGames = {};
        if (fs.existsSync(activeGamesPath)) activeGames = JSON.parse(fs.readFileSync(activeGamesPath));
        
        if (activeGames[extra.from]?.tod) {
            return extra.reply('⚠️ A game is already running.');
        }
        
        const isAdult = args.includes('18+');
        const rounds = parseInt(args[0]) || 10;
        
        activeGames[extra.from] = {
            tod: {
                status: 'waiting',
                players: [],
                startTime: Date.now(),
                joinDeadline: Date.now() + 30000,
                rounds: rounds,
                isAdult: isAdult,
                round: 0
            }
        };
        
        fs.writeFileSync(activeGamesPath, JSON.stringify(activeGames, null, 2));
        
        await sock.sendMessage(extra.from, {
            text: `┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔥 𝗧𝗥𝗨𝗧𝗛 𝗢𝗥 𝗗𝗔𝗥𝗘
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

@${extra.sender.split('@')[0]} started the game!

💬 Type *join* to enter (30s)
🛑 Type *endtod* to end anytime

🎯 *${rounds} rounds*
${isAdult ? '🔞 *Adult Mode* 🔞' : ''}

👥 Players: ${activeGames[extra.from].tod.players.length}`,
            mentions: [extra.sender]
        }, { quoted: msg });
        
        setTimeout(async () => {
            const game = activeGames[extra.from]?.tod;
            if (game && game.status === 'waiting' && game.players.length < 2) {
                await extra.reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔥 𝗧𝗥𝗨𝗧𝗛 𝗢𝗥 𝗗𝗔𝗥𝗘
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ Not enough players joined!
Only ${game.players.length}/2 players. Game cancelled.

_Start again with §tod_`);
                delete activeGames[extra.from]?.tod;
                fs.writeFileSync(activeGamesPath, JSON.stringify(activeGames, null, 2));
            }
        }, 30000);
    }
};