const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const os = require('os');

const EFFECTS = {
    baby:      'asetrate=44100*0.7,atempo=1.4',
    bass:      'bass=g=20',
    blown:     'volume=15',
    chipmunk:  'asetrate=44100*1.5,atempo=0.7',
    deep:      'asetrate=44100*0.7,atempo=1.4',
    demon:     'asetrate=44100*0.5,atempo=2',
    earrape:   'volume=30',
    fast:      'atempo=2.0',
    fat:       'asetrate=44100*0.7,bass=g=10',
    nightcore: 'asetrate=44100*1.3,atempo=1.0',
    radio:     'highpass=f=300,lowpass=f=3000',
    reverse:   'areverse',
    robot:     "afftfilt=real='hypot(re,im)*sin(0)':imag='hypot(re,im)*cos(0)':win_size=512:overlap=0.75",
    slow:      'atempo=0.5',
    smooth:    'lowpass=f=1000,volume=1.5',
    tupai:     'asetrate=44100*1.3,atempo=0.85',
};

async function downloadMedia(sock, quotedMsg) {
    const stream = await sock.downloadMediaMessage(quotedMsg);
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    return Buffer.concat(chunks);
}

async function applyAudioEffect(inputBuffer, effectName) {
    const effect = EFFECTS[effectName];
    if (!effect) throw new Error(`Unknown effect: ${effectName}`);

    const tmpIn  = path.join(os.tmpdir(), `vx_in_${Date.now()}.mp3`);
    const tmpOut = path.join(os.tmpdir(), `vx_out_${Date.now()}.mp3`);

    fs.writeFileSync(tmpIn, inputBuffer);

    await new Promise((resolve, reject) => {
        const cmd = ffmpeg(tmpIn);
        if (effect[0] === '-af') {
            cmd.audioFilters(effect[1]);
        }
        cmd.output(tmpOut)
           .audioCodec('libmp3lame')
           .on('end', resolve)
           .on('error', reject)
           .run();
    });

    const result = fs.readFileSync(tmpOut);
    fs.unlinkSync(tmpIn);
    fs.unlinkSync(tmpOut);
    return result;
}

module.exports = { downloadMedia, applyAudioEffect };
