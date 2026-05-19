const axios = require('axios');

const leagues = {
    epl: 'premier-league',
    laliga: 'laliga',
    bundesliga: 'bundesliga',
    seriea: 'serie-a',
    ligue1: 'ligue-1',
    ucl: 'uefa-champions-league',
    uel: 'uefa-europa-league',
    brasileirao: 'brasileirao-serie-a',
    ligamx: 'liga-mx',
    spl: 'saudi-pro-league',
    eredivisie: 'eredivisie',
    liganos: 'liganos',
    superlig: 'super-lig',
    mls: 'mls',
    argprimera: 'primera-division',
    jleague: 'j-league',
    npfl: 'npfl'
};

module.exports = {
    name: 'ftball',
    aliases: ['football', 'soccer', 'sports'],
    category: 'search',
    description: 'Live scores, tables, odds, betting tips — football, NBA, cricket',
    usage: '§ftball <command>',
    async execute(sock, msg, args, extra) {
        const subCommand = args[0]?.toLowerCase();
        const leagueCode = args[1]?.toLowerCase();
        
        // Show menu if no subcommand
        if (!subCommand) {
            const menu = `╔══════════════════════════╗
     ⚽ *SPORTS COMMANDS*
╚══════════════════════════╝

*📡 Live & Today*
\`§ftball live\` — 🔴 All live matches
\`§ftball flashscore\` — 📊 Full live board (all leagues)
\`§ftball today\` — All today's matches

*🏆 By League*
\`§ftball epl\` — Premier League
\`§ftball laliga\` — La Liga
\`§ftball bundesliga\` — Bundesliga
\`§ftball seriea\` — Serie A
\`§ftball ligue1\` — Ligue 1
\`§ftball ucl\` — Champions League
\`§ftball uel\` — Europa League
\`§ftball brasileirao\` — Brasileirão
\`§ftball ligamx\` — Liga MX
\`§ftball spl\` — Saudi Pro League
+ eredivisie, liganos, superlig, mls, argprimera, jleague, npfl...

*📋 Standings*
\`§ftball table epl\` — League table (any league code)

*💹 Betting*
\`§ftball odds epl\` — Today's match odds
\`§ftball tips epl\` — AI betting tips for today

*🏀 Basketball*
\`§ftball nba\` — NBA scores today
\`§ftball nbalive\` — 🔴 NBA live only

*🏏 Cricket*
\`§ftball cricket\` — Live cricket

*Status icons:* 🔴 Live · ⏰ Upcoming · ✅ Finished

> ©POWERED BY NEXUS`;
            
            return await extra.reply(menu);
        }
        
        // Live matches
        if (subCommand === 'live') {
            await extra.reply(`🔴 *Live Matches*\n\nFetching live scores...\n\n> ©POWERED BY NEXUS`);
            return;
        }
        
        // Flashscore
        if (subCommand === 'flashscore') {
            await extra.reply(`📊 *Live Scoreboard*\n\nFetching all live matches...\n\n> ©POWERED BY NEXUS`);
            return;
        }
        
        // Today's matches
        if (subCommand === 'today') {
            await extra.reply(`📅 *Today's Matches*\n\nFetching schedule...\n\n> ©POWERED BY NEXUS`);
            return;
        }
        
        // League table
        if (subCommand === 'table' && leagueCode) {
            const leagueName = leagues[leagueCode] || leagueCode;
            await extra.reply(`📋 *${leagueName.toUpperCase()} Standings*\n\nFetching league table...\n\n> ©POWERED BY NEXUS`);
            return;
        }
        
        // Odds
        if (subCommand === 'odds' && leagueCode) {
            await extra.reply(`💹 *${leagueCode.toUpperCase()} Match Odds*\n\nFetching betting odds...\n\n> ©POWERED BY NEXUS`);
            return;
        }
        
        // Betting tips
        if (subCommand === 'tips' && leagueCode) {
            await extra.reply(`🎯 *${leagueCode.toUpperCase()} Betting Tips*\n\nAI predictions...\n\n> ©POWERED BY NEXUS`);
            return;
        }
        
        // NBA
        if (subCommand === 'nba') {
            await extra.reply(`🏀 *NBA Scores Today*\n\nFetching basketball scores...\n\n> ©POWERED BY NEXUS`);
            return;
        }
        
        // NBA Live
        if (subCommand === 'nbalive') {
            await extra.reply(`🔴 *NBA Live Scores*\n\nFetching live basketball...\n\n> ©POWERED BY NEXUS`);
            return;
        }
        
        // Cricket
        if (subCommand === 'cricket') {
            await extra.reply(`🏏 *Live Cricket*\n\nFetching cricket scores...\n\n> ©POWERED BY NEXUS`);
            return;
        }
        
        // League matches (epl, laliga, etc.)
        if (leagues[subCommand]) {
            const leagueName = leagues[subCommand];
            await extra.reply(`⚽ *${subCommand.toUpperCase()} Matches*\n\nFetching ${leagueName} matches...\n\n> ©POWERED BY NEXUS`);
            return;
        }
        
        // If nothing matches, show menu
        const menu = `╔══════════════════════════╗
     ⚽ *SPORTS COMMANDS*
╚══════════════════════════╝

*📡 Live & Today*
\`§ftball live\` — 🔴 All live matches
\`§ftball flashscore\` — 📊 Full live board
\`§ftball today\` — All today's matches

*🏆 By League*
\`§ftball epl\` — Premier League
\`§ftball laliga\` — La Liga
\`§ftball bundesliga\` — Bundesliga
\`§ftball seriea\` — Serie A
\`§ftball ligue1\` — Ligue 1
\`§ftball ucl\` — Champions League
\`§ftball uel\` — Europa League

*📋 Standings*
\`§ftball table epl\` — League table

*💹 Betting*
\`§ftball odds epl\` — Match odds
\`§ftball tips epl\` — Betting tips

*🏀 Basketball*
\`§ftball nba\` — NBA scores
\`§ftball nbalive\` — 🔴 NBA live

*🏏 Cricket*
\`§ftball cricket\` — Live cricket

> ©POWERED BY NEXUS`;
        
        await extra.reply(menu);
    }
};