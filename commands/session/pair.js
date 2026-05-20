module.exports = {
    name: 'pair',
    aliases: ['pairing', 'paircode'],
    category: 'session',
    description: 'Pair your WhatsApp with Voltaria using a pairing code',
    usage: '§pair 254700123456',
    async execute(sock, msg, args, extra) {
        let isOwner = global.owner?.includes(msg.sender.split('@')[0]);
        if (!isOwner) return await extra.reply('❌ Owner only command.');

        let number = args[0];
        if (!number) return await extra.reply('❌ Provide your WhatsApp number.\nUsage: §pair 254700123456\n\n*Include country code without + or spaces*');

        // Clean the number
        let phoneNumber = number.replace(/[^0-9]/g, '');
        if (!phoneNumber.startsWith('254') && !phoneNumber.startsWith('1') && !phoneNumber.startsWith('91') && !phoneNumber.startsWith('44')) {
            return await extra.reply('❌ Please include country code (e.g., 254 for Kenya)');
        }

        try {
            await extra.reply(`📱 Requesting pairing code for +${phoneNumber}...`);

            // Request pairing code from WhatsApp
            const code = await sock.requestPairingCode(phoneNumber);
            
            await extra.reply(`✅ *Pairing Code Sent!*\n\n📌 Your code: *${code}*\n\n➡️ Go to WhatsApp → Settings → Linked Devices → Link with phone number\n➡️ Enter this code to pair with Voltaria\n\n*Code expires in 5 minutes*`);
        } catch (error) {
            console.error(error);
            await extra.reply(`❌ Failed to generate pairing code.\n\nError: ${error.message}\n\nMake sure the number is valid and WhatsApp is accessible.`);
        }
    }
};