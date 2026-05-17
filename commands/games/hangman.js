const words = ['apple', 'mango', 'grape', 'peach', 'berry', 'lemon', 'melon', 'candy', 'sugar', 'honey'];
const currencySymbol = '𝑵̶';

module.exports = {
    name: 'hangman',
    category: 'games',
    description: 'Play Hangman word guessing - add amount to bet coins',
    usage: '§hangman 500',
    isGroup: true,
    async execute(sock, msg, args, extra) {
        const bet = parseInt(args[0]);
        
        const word = words[Math.floor(Math.random() * words.length)];
        const display = '_'.repeat(word.length);
        
        activeHangman[extra.from] = {
            word: word,
            display: display,
            guesses: 6,
            guessedLetters: [],
            bet: bet || 0,
            channel: extra.from,
            sender: extra.sender
        };
        
        await extra.reply(`🔤 *HANGMAN*\n\n${bet ? `💰 Bet: ${currencySymbol} ${bet.toLocaleString()} Nex` : '💰 Friendly match'}\n\nWord: ${display.split('').join(' ')}\n\nGuesses left: 6\n\nType a letter to guess!`);
    }
};

let activeHangman = {};