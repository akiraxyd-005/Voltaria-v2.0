const axios = require('axios');

module.exports = {
    name: 'github',
    aliases: ['gh', 'repo'],
    category: 'search',
    description: 'Search GitHub repositories',
    usage: '§github <repo name>',
    async execute(sock, msg, args, extra) {
        const query = args.join(' ');
        
        if (!query) {
            return extra.reply(`❌ *Usage:* §github <repo name>\n\nExample: §github whatsapp bot`);
        }
        
        await extra.reply(`🐙 *Searching GitHub for "${query}"...*`);
        
        try {
            const response = await axios.get('https://api.github.com/search/repositories', {
                params: {
                    q: query,
                    sort: 'stars',
                    order: 'desc',
                    per_page: 5
                }
            });
            
            const repos = response.data.items;
            
            if (!repos || repos.length === 0) {
                return extra.reply(`❌ No repositories found for "${query}".`);
            }
            
            let result = `🐙 *GitHub Search: ${query}*\n\n`;
            for (let i = 0; i < repos.length; i++) {
                const repo = repos[i];
                result += `${i+1}. *${repo.full_name}*\n   ⭐ ${repo.stargazers_count} stars\n   🍴 ${repo.forks_count} forks\n   🔗 ${repo.html_url}\n\n`;
            }
            
            result += `> ©POWERED BY NEXUS`;
            await extra.reply(result);
        } catch (error) {
            await extra.reply(`❌ GitHub search failed. Please try again later.\n\n> ©POWERED BY NEXUS`);
        }
    }
};