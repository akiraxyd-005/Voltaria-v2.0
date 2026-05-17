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
            return extra.reply('⚠️ A game is already running.');
        }
        
        activeGames[extra.from] = {
            wcg: {
                status: 'waiting',
                players: [],
                startTime: Date.now(),
                joinDeadline: Date.now() + 45000
            }
        };
        
        fs.writeFileSync(activeGamesPath, JSON.stringify(activeGames, null, 2));
        
        await extra.reply(`╔═══════════════════╗
   🔤 *WORD CHAIN GAME* 🔤
╚═══════════════════╝

📜 *How to Play:*
┃ ▸ Type a word starting with last letter
┃ ▸ Must be valid English word
┃ ▸ Min length increases each round
┃ ▸ Time gets shorter - stay sharp!

╭─────────────────╮
│  ✍️ Type *join* now!  │
│  ⏳ Starting in *45s*...  │
╰─────────────────╯`);
        
        setTimeout(async () => {
            const game = activeGames[extra.from]?.wcg;
            if (game && game.status === 'waiting') {
                if (game.players.length < 2) {
                    await extra.reply('❌ Not enough players joined.\n_Need at least 2 to start!_');
                    delete activeGames[extra.from]?.wcg;
                    fs.writeFileSync(activeGamesPath, JSON.stringify(activeGames, null, 2));
                }
            }
        }, 45000);
    }
};