// Quran verse command
module.exports = {
    name: 'quran',
    aliases: ['surah', 'koran'],
    category: 'religion',
    description: 'Get a random Quran verse or search by surah and ayah',
    usage: '§quran\n§quran 1:1',
    async execute(sock, msg, args, extra) {
        try {
            let verse;
            
            if (args.length) {
                // Search by surah:ayah
                let reference = args[0];
                let [surah, ayah] = reference.split(':');
                
                let response = await fetch(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/en.asad`);
                let data = await response.json();
                
                if (data.code !== 200) {
                    return await extra.reply(`❌ Verse not found. Try: §quran 1:1`);
                }
                
                verse = `◆ *Quran ${data.data.surah.name} (${data.data.surah.number}:${data.data.numberInSurah})*\n\n"${data.data.text}"\n\n📖 Translation: Muhammad Asad`;
            } else {
                // Random verse
                let randomSurah = Math.floor(Math.random() * 114) + 1;
                let randomAyah = Math.floor(Math.random() * 100) + 1;
                
                let response = await fetch(`https://api.alquran.cloud/v1/ayah/${randomSurah}:${randomAyah}/en.asad`);
                let data = await response.json();
                
                if (data.code !== 200) {
                    return await extra.reply(`❌ Error fetching verse. Try again.`);
                }
                
                verse = `◆ *Quran ${data.data.surah.name} (${data.data.surah.number}:${data.data.numberInSurah})*\n\n"${data.data.text}"\n\n📖 Translation: Muhammad Asad`;
            }
            
            await extra.reply(verse);
        } catch (error) {
            await extra.reply(`❌ Error: ${error.message}`);
        }
    }
};