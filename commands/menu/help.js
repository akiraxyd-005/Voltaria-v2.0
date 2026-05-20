module.exports = {
    name: 'help',
    aliases: ['category', 'cmds'],
    category: 'menu',
    description: 'Show commands for a specific category',
    usage: '§help <category>',
    async execute(sock, msg, args, extra) {
        if (!args.length) {
            return await extra.reply(`╭──────༺𓆩⛧𓆪༻──────╮
       .CATEGORIES.
╰──────༺𓆩⛧𓆪༻──────╯

༺🤖༻ ai          ༺🎐༻ anime
༺🎵༻ audio       ༺⚙️༻ config
༺♻️༻ debug       ༺📥༻ download
༺💎༻ economy     ༺🎉༻ fun
༺🎮༻ games       ༺🧑‍🧑‍🧒‍🧒༻ group
༺🔞༻ hentai      ༺ℹ️༻ info
༺🎨༻ logo        ༺🖼️༻ media
༺📦༻ misc        ༺⚜️༻ owner
༺💫༻ reactions   ༺📖༻ religion
༺🔍༻ search      ༺🔐༻ session
༺⚙️༻ settings    ༺✍️༻ text
༺🛠️༻ tools       ༺🧩༻ utility
༺📱༻ whatsapp

╭────༺☾༻────╮
│ §help <category>
│ Example: §help download
╰────༺☾༻────╯

> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`);
        }

        const cat = args[0].toLowerCase();
        
        const categories = {
            ai: { name: '🤖 AI', cmds: ['§gpt - Chat with Gemini AI', '§vision - Analyze images', '§summarize - Summarize text', '§recipe - Generate recipes', '§tts - Text to speech', '§removebg - Remove background', '§enhance - Enhance image', '§upscale - Upscale image'] },
            anime: { name: '🎐 ANIME', cmds: ['§anime - Search anime', '§waifu - Random waifu', '§neko - Neko girls', '§animequote - Random quote', '§foxxgirl - Fox girls'] },
            audio: { name: '🎵 AUDIO', cmds: ['§deep - Deep voice', '§nightcore - Nightcore', '§robot - Robot voice', '§bass - Bass boost', '§chipmunk - Chipmunk', '§earrape - Earrape', '§slow - Slow down', '§fast - Speed up', '§reverse - Reverse audio'] },
            download: { name: '📥 DOWNLOAD', cmds: ['§play - Search & play music', '§yt - Download YouTube audio', '§ytvideo - Download YouTube video', '§yts - Search YouTube', '§tiktok - TikTok download', '§instagram - IG download', '§twitter - Twitter/X download', '§facebook - FB download', '§capcut - CapCut template'] },
            economy: { name: '💎 ECONOMY', cmds: ['§balance - Check balance', '§work - Work for money', '§daily - Daily reward', '§rob - Rob someone', '§pay - Pay someone', '§slots - Slot machine', '§blackjack - Blackjack', '§coinflip - Coin flip', '§dice - Roll dice'] },
            fun: { name: '🎉 FUN', cmds: ['§ship - Ship users', '§marry - Marry someone', '§divorce - Divorce', '§adopt - Adopt user', '§duel - Duel someone', '§date - Go on a date', '§hug - Hug someone', '§kiss - Kiss someone', '§slap - Slap someone'] },
            games: { name: '🎮 GAMES', cmds: ['§ttt - Tic Tac Toe', '§hangman - Hangman', '§trivia - Trivia quiz', '§wordle - Wordle', '§riddle - Solve riddle', '§whoami - Guess who', '§wyr - Would you rather', '§tod - Truth or dare'] },
            group: { name: '🧑‍🧑‍🧒‍🧒 GROUP', cmds: ['§tagall - Tag everyone', '§poll - Create poll', '§warn - Warn user', '§kick - Kick user', '§promote - Make admin', '§demote - Remove admin', '§mute - Mute user', '§setwelcome - Set welcome', '§setgoodbye - Set goodbye'] },
            hentai: { name: '🔞 HENTAI', cmds: ['§waifu - NSFW waifu', '§hentai - Random hentai', '§hentaigif - Hentai GIFs', '§trap - Trap images', '§cum - Cum related', '§panties - Panties'] },
            info: { name: 'ℹ️ INFO', cmds: ['§botinfo - Bot stats', '§groupinfo - Group info', '§whois - User info', '§getpp - Get profile pic', '§cinfo - Chat info', '§repo - Bot repository'] },
            owner: { name: '⚜️ OWNER', cmds: ['§on - Enable bot', '§off - Disable bot', '§nsfw - Toggle NSFW', '§broadcast - Broadcast message', '§restart - Restart bot', '§setpp - Set profile pic', '§ban - Ban user', '§unban - Unban user', '§sudo - Add sudo user'] },
            reactions: { name: '💫 REACTIONS', cmds: ['§hug - Hug', '§kiss - Kiss', '§slap - Slap', '§pat - Pat', '§cuddle - Cuddle', '§dance - Dance'] },
            religion: { name: '📖 RELIGION', cmds: ['§bible - Bible verses', '§quran - Quran verses'] },
            search: { name: '🔍 SEARCH', cmds: ['§google - Google search', '§image - Image search', '§yts - YouTube search', '§weather - Weather info', '§news - Latest news', '§wiki - Wikipedia'] },
            session: { name: '🔐 SESSION', cmds: ['§pair - Pair WhatsApp', '§addsession - Add session', '§listsessions - List sessions', '§delsession - Delete session'] },
            settings: { name: '⚙️ SETTINGS', cmds: ['§setbio - Set bot bio', '§setname - Set bot name', '§setpp - Set profile', '§getprivacy - Get privacy', '§setprivacy - Set privacy'] },
            text: { name: '✍️ TEXT', cmds: ['§say - Repeat text', '§fancy - Fancy text', '§fancylist - Show styles'] },
            tools: { name: '🛠️ TOOLS', cmds: ['§sticker - Make sticker', '§qr - Generate QR', '§readqr - Read QR', '§schedule - Schedule', '§trt - Translate', '§ss - Screenshot', '§afk - Away', '§calc - Calculator', '§time - World time'] },
            whatsapp: { name: '📱 WHATSAPP', cmds: ['§unsend - Delete message', '§forward - Forward', '§block - Block user', '§clear - Clear chat', '§pinchat - Pin chat', '§archive - Archive', '§del - Delete for all'] }
        };

        if (!categories[cat]) {
            return await extra.reply(`╭──────༺𓆩⛧𓆪༻──────╮
     .NOT FOUND.
╰──────༺𓆩⛧𓆪༻──────╯

❌ Category "${cat}" not found

╭────༺☾༻────╮
│ Use §help to see
│ all categories
╰────༺☾༻────╯

> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`);
        }

        const catData = categories[cat];
        let cmdList = `╭──────༺𓆩⛧𓆪༻──────╮
     ${catData.name}
╰──────༺𓆩⛧𓆪༻──────╯\n\n`;

        for (const cmd of catData.cmds) {
            cmdList += `༺✦༻ ${cmd}\n`;
        }

        cmdList += `\n╭────༺☾༻────╮
│ §menu for full menu
╰────༺☾༻────╯

> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`;

        await extra.reply(cmdList);
    }
};