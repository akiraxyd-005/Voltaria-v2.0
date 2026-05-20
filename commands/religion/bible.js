// Bible verse command using an API
module.exports = {
    name: 'bible',
    aliases: ['verse', 'scripture'],
    category: 'religion',
    description: 'Get a random Bible verse or search by reference',
    usage: '§bible\n§bible John 3:16',
    async execute(sock, msg, args, extra) {
        try {
            let verse;
            
            if (args.length) {
                // Search by reference
                let reference = args.join(' ');
                let response = await fetch(`https://bible-api.com/${encodeURIComponent(reference)}`);
                let data = await response.json();
                
                if (data.error) {
                    return await extra.reply(`❌ Verse not found. Try: §bible John 3:16`);
                }
                
                verse = `◆ *${data.reference}*\n\n"${data.text}"\n\n📖 ${data.translation_name || 'KJV'}`;
            } else {
                // Random verse
                let books = ['John', 'Psalm', 'Proverbs', 'Romans', 'Genesis', 'Matthew', 'Luke'];
                let randomBook = books[Math.floor(Math.random() * books.length)];
                let randomChapter = Math.floor(Math.random() * 50) + 1;
                let randomVerse = Math.floor(Math.random() * 30) + 1;
                
                let response = await fetch(`https://bible-api.com/${randomBook}+${randomChapter}:${randomVerse}`);
                let data = await response.json();
                
                if (data.error) {
                    return await extra.reply(`❌ Error fetching verse. Try again.`);
                }
                
                verse = `◆ *${data.reference}*\n\n"${data.text}"\n\n📖 ${data.translation_name || 'KJV'}`;
            }
            
            await extra.reply(verse);
        } catch (error) {
            await extra.reply(`❌ Error: ${error.message}`);
        }
    }
};