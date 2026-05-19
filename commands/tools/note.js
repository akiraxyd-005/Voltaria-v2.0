const fs = require('fs');
const notesPath = './database/notes.json';

module.exports = {
    name: 'note',
    aliases: ['notes', 'memo'],
    category: 'tools',
    description: 'Save, view, or delete notes',
    usage: '§note add <text> | §note list | §note delete <id>',
    async execute(sock, msg, args, extra) {
        const action = args[0]?.toLowerCase();
        const sender = extra.sender;
        
        let notes = {};
        if (fs.existsSync(notesPath)) notes = JSON.parse(fs.readFileSync(notesPath));
        if (!notes[sender]) notes[sender] = [];
        
        if (action === 'add') {
            const text = args.slice(1).join(' ');
            if (!text) return extra.reply(`❌ *Usage:* §note add <text>`);
            
            const id = Date.now();
            notes[sender].push({ id, text, date: new Date().toISOString() });
            fs.writeFileSync(notesPath, JSON.stringify(notes, null, 2));
            
            await extra.reply(`📝 *Note added!*\n\nID: ${id}\n📌 ${text}\n\n> ©POWERED BY NEXUS`);
        }
        else if (action === 'list') {
            if (notes[sender].length === 0) {
                return extra.reply(`📝 *No notes found.*\n\nUse §note add <text> to create one.\n\n> ©POWERED BY NEXUS`);
            }
            
            let list = `📋 *Your Notes*\n\n`;
            for (let i = 0; i < notes[sender].length; i++) {
                const note = notes[sender][i];
                list += `${i+1}. [${note.id}] ${note.text.substring(0, 50)}${note.text.length > 50 ? '...' : ''}\n`;
            }
            list += `\n> ©POWERED BY NEXUS`;
            await extra.reply(list);
        }
        else if (action === 'delete') {
            const id = parseInt(args[1]);
            if (!id) return extra.reply(`❌ *Usage:* §note delete <id>`);
            
            const index = notes[sender].findIndex(n => n.id === id);
            if (index === -1) return extra.reply(`❌ Note not found.`);
            
            notes[sender].splice(index, 1);
            fs.writeFileSync(notesPath, JSON.stringify(notes, null, 2));
            
            await extra.reply(`✅ *Note deleted!*\n\n> ©POWERED BY NEXUS`);
        }
        else {
            await extra.reply(`📝 *Note System*\n\n§note add <text> - Add a note\n§note list - View all notes\n§note delete <id> - Delete a note\n\n> ©POWERED BY NEXUS`);
        }
    }
};