const riddles = [
    { question: "What has keys but can't open locks?", answer: "piano" },
    { question: "What has a face and two hands but no arms?", answer: "clock" },
    { question: "What gets wetter as it dries?", answer: "towel" }
];

module.exports = {
    name: 'riddle',
    category: 'games',
    description: 'Solve riddles fastest - add amount to bet coins',
    usage: '§riddle 500',
    isGroup: true,
    async execute(sock, msg, args, extra) {
        const bet = parseInt(args[0]);
        const riddle = riddles[Math.floor(Math.random() * riddles.length)];
        
        activeRiddle[extra.from] = {
            answer: riddle.answer,
            bet: bet || 0,
            channel: extra.from,
            sender: extra.sender,
            startTime: Date.now()
        };
        
        await extra.reply(`🤔 *RIDDLE*\n\n${riddle.question}\n\n${bet ? `💰 Bet: ${currencySymbol} ${bet.toLocaleString()} Nex` : '💰 Friendly match'}\n\nFirst to type the correct answer wins!`);
        
        setTimeout(() => {
            if (activeRiddle[extra.from]) {
                delete activeRiddle[extra.from];
            }
        }, 30000);
    }
};

let activeRiddle = {};