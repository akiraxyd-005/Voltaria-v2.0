const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const { PassThrough } = require('stream');

const tempDir = path.join(process.cwd(), 'temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

/**
 * Download media from WhatsApp message
 */
async function downloadMedia(sock, quotedMsg) {
    const mediaType = Object.keys(quotedMsg)[0];
    const mediaMsg = quotedMsg[mediaType];
    
    const stream = await sock.downloadMediaMessage(quotedMsg);
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
}

/**
 * Apply audio effect using FFmpeg
 */
async function applyAudioEffect(inputBuffer, effect, effectValue = null) {
    return new Promise((resolve, reject) => {
        const inputPath = path.join(tempDir, `input_${Date.now()}.mp3`);
        const outputPath = path.join(tempDir, `output_${Date.now()}.mp3`);
        
        fs.writeFileSync(inputPath, inputBuffer);
        
        let command = ffmpeg(inputPath);
        
        switch(effect) {
            case 'deep':
                command.audioFilters('asetrate=44100*0.8,atempo=1.2');
                break;
            case 'smooth':
                command.audioFilters('aecho=0.8:0.9:1000:0.3');
                break;
            case 'fat':
                command.audioFilters('aecho=0.8:0.88:60:0.4');
                break;
            case 'tupai':
                command.audioFilters('asetrate=44100*0.7,atempo=1.4');
                break;
            case 'blown':
                command.audioFilters('aecho=0.9:0.9:100:0.5');
                break;
            case 'radio':
                command.audioFilters('aecho=0.8:0.9:1000:0.3,aecho=0.8:0.9:30:0.5');
                break;
            case 'robot':
                command.audioFilters('aecho=0.8:0.9:50:0.4,aecho=0.8:0.88:30:0.3');
                break;
            case 'chipmunk':
                command.audioFilters('asetrate=44100*1.5,atempo=0.67');
                break;
            case 'nightcore':
                command.audioFilters('asetrate=44100*1.25,atempo=0.8,aresample=44100');
                break;
            case 'earrape':
                command.audioFilters('volume=3');
                break;
            case 'bass':
                command.audioFilters('bass=g=10,volume=1.5');
                break;
            case 'reverse':
                command.audioFilters('areverse');
                break;
            case 'slow':
                command.audioFilters('atempo=0.7');
                break;
            case 'fast':
                command.audioFilters('atempo=1.5');
                break;
            case 'baby':
                command.audioFilters('asetrate=44100*1.3,atempo=0.77');
                break;
            case 'deamon':
                command.audioFilters('asetrate=44100*0.6,atempo=1.6,aecho=0.8:0.9:100:0.4');
                break;
            default:
                command = ffmpeg(inputPath);
        }
        
        command.toFormat('mp3')
            .on('end', () => {
                const outputBuffer = fs.readFileSync(outputPath);
                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
                resolve(outputBuffer);
            })
            .on('error', (err) => {
                fs.unlinkSync(inputPath);
                if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
                reject(err);
            })
            .save(outputPath);
    });
}

module.exports = { downloadMedia, applyAudioEffect };