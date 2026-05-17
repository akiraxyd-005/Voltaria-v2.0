const fs = require('fs');
const economyPath = './database/economy.json';
const currencySymbol = '𝑵̶';

module.exports = {
    name: 'ttt',
    category: 'games',
    description: 'Play Tic Tac Toe - add amount to bet coins',
    usage: '§ttt @user 500',
    isGroup: true,
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const bet = parseInt(args[1]);
        
        if (!mentioned || mentioned.length === 0) {
            return extra.reply('❌ Mention someone to play with!\nUsage: *§ttt @user 500*');
        }
        
        const opponent = mentioned[0];
        
        if (opponent === extra.sender) {
            return extra.reply('❌ You cannot play against yourself!');
        }
        
        let economy = {};
        if (fs.existsSync(economyPath)) economy = JSON.parse(fs.readFileSync(economyPath));
        
        if (bet) {
            const userMoney = economy[extra.sender]?.balance || 0;
            const oppMoney = economy[opponent]?.balance || 0;
            
            if (userMoney < bet) {
                return extra.reply(`❌ You don't have enough ${currencySymbol} Nex!\nYou have: ${currencySymbol} ${userMoney.toLocaleString()}`);
            }
            if (oppMoney < bet) {
                return extra.reply(`❌ @${opponent.split('@')[0]} doesn't have enough ${currencySymbol} Nex!`, { mentions: [opponent] });
            }
        }
        
        const board = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        
        const gameState = {
            board: board,
            turn: 'X',
            playerX: extra.sender,
            playerO: opponent,
            bet: bet || 0,
            winner: null
        };
        
        activeTTT[extra.from] = gameState;
        
        await sock.sendMessage(extra.from, {
            text: `🎮 *TIC TAC TOE*\n\n@${extra.sender.split('@')[0]} (X) vs @${opponent.split('@')[0]} (O)\n${bet ? `💰 Bet: ${currencySymbol} ${bet.toLocaleString()} Nex` : '💰 Friendly match'}\n\n${displayBoard(board)}\n\nType a number (1-9) to place your mark!`,
            mentions: [extra.sender, opponent]
        }, { quoted: msg });
    }
};

let activeTTT = {};

function displayBoard(board) {
    return `
┌───┬───┬───┐
│ ${board[0]} │ ${board[1]} │ ${board[2]} │
├───┼───┼───┤
│ ${board[3]} │ ${board[4]} │ ${board[5]} │
├───┼───┼───┤
│ ${board[6]} │ ${board[7]} │ ${board[8]} │
└───┴───┴───┘`;
}