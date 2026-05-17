const axios = require('axios');
const fs = require('fs');
const AdmZip = require('adm-zip');

module.exports = {
    name: 'gitclone',
    category: 'download',
    description: 'Download GitHub repo as zip (via GitHub API)',
    usage: '§gitclone <GitHub Repo URL>',
    async execute(sock, msg, args, extra) {
        const url = args[0];
        
        if (!url || !url.includes('github.com')) {
            return extra.reply('❌ Please provide a valid GitHub Repository URL.\n\nUsage: §gitclone <GitHub Repo URL>');
        }
        
        await extra.reply('⏳ Cloning repository...');
        
        try {
            const repoPath = url.replace('https://github.com/', '').replace('.git', '');
            const zipUrl = `https://api.github.com/repos/${repoPath}/zipball`;
            
            const response = await axios.get(zipUrl, { responseType: 'arraybuffer' });
            const zipBuffer = Buffer.from(response.data);
            
            await sock.sendMessage(extra.from, {
                document: zipBuffer,
                mimetype: 'application/zip',
                fileName: `${repoPath.split('/')[1]}.zip`,
                caption: `📦 *GitHub Repository*\n📁 ${repoPath}`
            }, { quoted: msg });
        } catch (error) {
            extra.reply('❌ Failed to clone repository.');
        }
    }
};