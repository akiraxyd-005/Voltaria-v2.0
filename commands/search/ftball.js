const axios = require('axios');

module.exports = {
    name: 'ftball',
    aliases: ['football', 'soccer', 'sports'],
    category: 'search',
    description: 'Live scores, tables, odds, betting tips — football, NBA, cricket',
    usage: '§ftball <league>',
    async execute(sock, msg, args, extra) {
        const league = args.join(' ') || 'premier-league';
        
        await extra.reply(`⚽ *Fetching ${league} updates...*`);
        
        try {
            const response = await axios.get(`https://api.football-data.org/v4/competitions/PL/matches`, {
                params: {
                    status: 'LIVE'
                },
                headers: {
                    'X-Auth-Token': process.env.FOOTBALL_API_KEY
                }
            });
            
            const matches = response.data.matches;
            
            if (!matches || matches.length === 0) {
                return extra.reply(`⚽ *No live matches at the moment.*\n\nCheck back later for scores!\n\n> ©POWERED BY NEXUS`);
            }
            
            let result = `⚽ *Live Football Scores*\n\n`;
            for (let i = 0; i < Math.min(matches.length, 5); i++) {
                const match = matches[i];
                result += `*${match.homeTeam.name}* ${match.score.fullTime.home} - ${match.score.fullTime.away} *${match.awayTeam.name}*\n⏱️ ${match.status}\n\n`;
            }
            
            result += `> ©POWERED BY NEXUS`;
            await extra.reply(result);
        } catch (error) {
            await extra.reply(`⚽ *Football/Sports Info*\n\n💡 Try: §ftball premier-league\n💡 §ftball champions-league\n💡 §ftball nba\n\n> ©POWERED BY NEXUS`);
        }
    }
};