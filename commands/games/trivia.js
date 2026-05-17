const axios = require('axios');
const fs = require('fs');
const economyPath = './database/economy.json';
const currencySymbol = '𝑵̶';

module.exports = {
    name: 'trivia',
    category: 'games',
    description: 'Start Trivia Game (easy/medium/hard) - add amount to bet coins',
    usage: '§trivia easy 500',
    isGroup: true,
    async execute(sock, msg, args, extra) {
        const difficulty = args[0]?.toLowerCase() || 'medium';
        const bet = parseInt(args[1]);
        
        if (!['easy', 'medium', 'hard'].includes(difficulty)) {
            return extra.reply('❌ Invalid difficulty! Use: easy, medium, or hard');
        }
        
        let economy = {};
        if (fs.existsSync(economyPath)) economy = JSON.parse(fs.readFileSync(economyPath));
        
        if (bet) {
            const userMoney = economy[extra.sender]?.balance || 0;
            if (userMoney < bet) {
                return extra.reply(`❌ You don't have enough ${currencySymbol} Nex!\nYou have: ${currencySymbol} ${userMoney.toLocaleString()}`);
            }
            economy[extra.sender].balance -= bet;
            fs.writeFileSync(economyPath, JSON.stringify(economy, null, 2));
        }
        
        try {
            const { data } = await axios.get(`https://opentdb.com/api.php?amount=1&difficulty=${difficulty}&type=multiple`);
            const question = data.results[0];
            
            const options = [...question.incorrect_answers, question.correct_answer];
            for (let i = options.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [options[i], options[j]] = [options[j], options[i]];
            }
            
            let optionsText = '';
            for (let i = 0; i < options.length; i++) {
                optionsText += `${i+1}. ${options[i]}\n`;
            }
            
            const answer = options.findIndex(opt => opt === question.correct_answer) + 1;
            
            activeTrivia[extra.from] = {
                answer: answer,
                bet: bet || 0,
                channel: extra.from,
                sender: extra.sender
            };
            
            await extra.reply(`📚 *TRIVIA* (${difficulty.toUpperCase()})\n\n📝 ${question.question.replace(/&quot;/g, '"').replace(/&#039;/g, "'")}\n\n${optionsText}\n\nType the number of your answer (1-4)!\n⏱️ You have 30 seconds!`);
            
            setTimeout(async () => {
                if (activeTrivia[extra.from]) {
                    delete activeTrivia[extra.from];
                    await extra.reply('⏰ Time\'s up! No one answered correctly.');
                }
            }, 30000);
            
        } catch (error) {
            extra.reply('❌ Failed to fetch trivia question. Try again later.');
        }
    }
};

let activeTrivia = {};