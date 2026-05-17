const fs = require('fs');
const words = {
    easy: { word: 'FLAMINGO', hint: 'A pink bird' },
    medium: { word: 'FERVORS', hint: '7 letters, starts with F' },
    hard: { word: 'MYSTERY', hint: 'Something unknown' }
};

module.exports = {
    name: 'hangman',
    category: 'games',
    description: 'Play Hangman word guessing',
    usage: '§hangman',
    isGroup: true,
    async execute(sock, msg, args, extra) {
        const difficulty = args[0]?.toLowerCase() || 'medium';
        const wordData = words[difficulty] || words.medium;
        const word = wordData.word;
        const hint = wordData.hint;
        
        activeHangman[extra.from] = {
            word: word,
            display: '_'.repeat(word.length),
            guesses: 6,
            guessedLetters: [],
            channel: extra.from
        };
        
        const hangmanDisplay = `
┏━━━━━━━━━━━━━━━━━━━━━━┓
┃  🪢  𝗛𝗔𝗡𝗚𝗠𝗔𝗡
┗━━━━━━━━━━━━━━━━━━━━━━┛

  ┌───┐
  │   │
  │
  │
  │
══╧══

  📝 Word: ${'_ '.repeat(word.length)}
  💡 Hint: ${hint}
  🎯 🟡 ${difficulty.toUpperCase()}
  ❤️ Lives: 6/6

  ━━━━━━━━━━━━━━━━━━
  📤 Guess a letter or the full word
  ⏱ 30s per guess`;
        
        await extra.reply(hangmanDisplay);
    }
};

let activeHangman = {};