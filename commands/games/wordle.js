const words5 = ['apple', 'mango', 'grape', 'peach', 'berry', 'lemon', 'melon', 'candy', 'sugar', 'honey', 'bread', 'cream', 'frost', 'bloom', 'crown'];

module.exports = {
    name: 'wordle',
    category: 'games',
    description: 'Text-based Wordle — guess the secret 5-letter word in 6 tries (🟩🟨⬛)',
    usage: '§wordle',
    isGroup: true,
    async execute(sock, msg, args, extra) {
        const secret = words5[Math.floor(Math.random() * words5.length)];
        
        activeWordle[extra.from] = {
            secret: secret,
            attempts: 0,
            maxAttempts: 6,
            guesses: [],
            channel: extra.from,
            sender: extra.sender
        };
        
        await extra.reply(`🎯 *WORDLE*\n\nGuess the 5-letter word!\nYou have 6 attempts.\n\n🟩 = Correct letter, correct position\n🟨 = Correct letter, wrong position\n⬛ = Wrong letter\n\nType your 5-letter guess!`);
    }
};

let activeWordle = {};

function checkGuess(guess, secret) {
    let result = '';
    for (let i = 0; i < 5; i++) {
        if (guess[i] === secret[i]) {
            result += '🟩';
        } else if (secret.includes(guess[i])) {
            result += '🟨';
        } else {
            result += '⬛';
        }
    }
    return result;
}