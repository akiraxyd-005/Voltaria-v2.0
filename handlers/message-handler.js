module.exports = async (sock, msg, commandHandler, prefix, botName) => {
    try {
        // Get push name if available
        let pushName = msg.pushName || '';
        if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
            pushName = msg.message.extendedTextMessage.contextInfo.participant.split('@')[0];
        }

        // Format message object
        const formattedMsg = {
            key: msg.key,
            chat: msg.key.remoteJid,
            sender: msg.key.participant || msg.key.remoteJid,
            isGroup: msg.key.remoteJid.endsWith('@g.us'),
            message: msg.message,
            pushName: pushName,
            quoted: msg.message?.extendedTextMessage?.contextInfo?.quotedMessage ? {
                key: {
                    id: msg.message.extendedTextMessage.contextInfo.stanzaId,
                    remoteJid: msg.message.extendedTextMessage.contextInfo.remoteJid || msg.key.remoteJid,
                    fromMe: msg.message.extendedTextMessage.contextInfo.participant === sock.user.id
                },
                sender: msg.message.extendedTextMessage.contextInfo.participant,
                message: msg.message.extendedTextMessage.contextInfo.quotedMessage,
                fromMe: msg.message.extendedTextMessage.contextInfo.participant === sock.user.id
            } : null,
            mentionedJid: msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [],
            timestamp: msg.messageTimestamp
        };

        // Extra functions for commands
        const extra = {
            sender: formattedMsg.sender,
            from: formattedMsg.chat,
            chat: formattedMsg.chat,
            isGroup: formattedMsg.isGroup,
            isAdmin: formattedMsg.isAdmin,
            isOwner: formattedMsg.isOwner,
            pushName: formattedMsg.pushName,
            reply: async (text, options = {}) => {
                return await sock.sendMessage(formattedMsg.chat, { text, ...options });
            },
            sendImage: async (url, caption) => {
                await sock.sendMessage(formattedMsg.chat, { image: { url }, caption });
            },
            sendVideo: async (url, caption) => {
                await sock.sendMessage(formattedMsg.chat, { video: { url }, caption });
            },
            sendAudio: async (url, mimetype = 'audio/mpeg') => {
                await sock.sendMessage(formattedMsg.chat, { audio: { url }, mimetype });
            },
            sendGif: async (url, caption) => {
                await sock.sendMessage(formattedMsg.chat, { video: { url }, gifPlayback: true, caption });
            },
            react: async (emoji) => {
                await sock.sendMessage(formattedMsg.chat, { react: { text: emoji, key: msg.key } });
            },
            sendContact: async (number, name) => {
                await sock.sendMessage(formattedMsg.chat, {
                    contacts: {
                        displayName: name,
                        contacts: [{ vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;type=CELL;type=VOICE;waid=${number}:+${number}\nEND:VCARD` }]
                    }
                });
            },
            sendButton: async (text, buttons) => {
                await sock.sendMessage(formattedMsg.chat, {
                    text: text,
                    buttons: buttons,
                    headerType: 1
                });
            },
            downloadMedia: async (message) => {
                let media = await sock.downloadMediaMessage(message);
                return media;
            }
        };

        // Check if admin (only for groups)
        if (formattedMsg.isGroup) {
            try {
                const groupMetadata = await sock.groupMetadata(formattedMsg.chat);
                const participants = groupMetadata.participants;
                const senderData = participants.find(p => p.id === formattedMsg.sender);
                formattedMsg.isAdmin = senderData?.admin === 'admin';
                formattedMsg.isSuperAdmin = senderData?.admin === 'superadmin';
            } catch (err) {
                formattedMsg.isAdmin = false;
                formattedMsg.isSuperAdmin = false;
            }
        } else {
            formattedMsg.isAdmin = false;
            formattedMsg.isSuperAdmin = false;
        }

        // Check if owner
        const owners = global.owner || ['254108720384'];
        formattedMsg.isOwner = owners.includes(formattedMsg.sender.split('@')[0]);

        // Get group metadata if needed
        if (formattedMsg.isGroup) {
            try {
                formattedMsg.groupMetadata = await sock.groupMetadata(formattedMsg.chat);
            } catch (err) {
                formattedMsg.groupMetadata = null;
            }
        }

        // Pass to command handler
        await commandHandler(sock, formattedMsg, extra, prefix, botName);

    } catch (error) {
        console.error('Message handler error:', error);
    }
};