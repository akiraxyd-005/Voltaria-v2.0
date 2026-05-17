const celebrities = [
    { name: "JUDY GARLAND", clues: ["Which actress's real name was Frances Ethel Gumm?", "Not Doris Day or Julie Andrews", "2 words, 11 letters, starts with J ends with D"] }
];

module.exports = {
    name: 'whoami',
    category: 'games',
    description: 'Who Am I? — 3 clues about a celebrity',
    usage: '§whoami',
    isGroup: true,
    async execute(sock, msg, args, extra) {
        const celebrity = celebrities[0];
        
        activeWhoami[extra.from] = {
            answer: celebrity.name,
            clueIndex: 0,
            clues: celebrity.clues,
            channel: extra.from,
            startTime: Date.now()
        };
        
        await extra.reply(`🕵️ *WHO AM I?*

🔍 *Clue 1:* ${celebrity.clues[0]}

_First to type the correct name wins coins!_
_More clues drop in 30 and 60 seconds._
_Game ends after 90 seconds.`);
        
        // Send second clue after 30 seconds
        setTimeout(async () => {
            if (activeWhoami[extra.from]) {
                await extra.reply(`🔍 *Clue 2:* ${celebrity.clues[1]}`);
            }
        }, 30000);
        
        // Send third clue after 60 seconds
        setTimeout(async () => {
            if (activeWhoami[extra.from]) {
                await extra.reply(`🔍 *Clue 3:* ${celebrity.clues[2]}`);
            }
        }, 60000);
        
        // End game after 90 seconds
        setTimeout(async () => {
            if (activeWhoami[extra.from]) {
                await extra.reply(`⏰ Time's up! Nobody got it.

The answer was: *${celebrity.name}*`);
                delete activeWhoami[extra.from];
            }
        }, 90000);
    }
};

let activeWhoami = {};