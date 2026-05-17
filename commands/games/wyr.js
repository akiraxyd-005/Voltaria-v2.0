const wyrQuestions = [
    "Would you rather be able to fly or be invisible?",
    "Would you rather travel 100 years into the past or 100 years into the future?",
    "Would you rather have unlimited money or unlimited time?"
];

const wyr18 = [
    "Would you rather date your ex or be single forever?",
    "Would you rather give up social media or give up dating apps?"
];

module.exports = {
    name: 'wyr',
    category: 'games',
    description: 'Would You Rather party game — group only. Add "18+" for adult questions',
    usage: '§wyr | §wyr 18+',
    isGroup: true,
    async execute(sock, msg, args, extra) {
        const isAdult = args.includes('18+');
        const pool = isAdult ? wyr18 : wyrQuestions;
        const random = pool[Math.floor(Math.random() * pool.length)];
        
        await extra.reply(`🎲 *WOULD YOU RATHER*\n\n${random}${isAdult ? '\n\n🔞 *Adult Content* 🔞' : ''}\n\nReply with your choice!`);
    }
};