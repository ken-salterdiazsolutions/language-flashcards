/**
 * Decode an audio Blob and re-encode as 16-bit mono LINEAR16 WAV at 48kHz.
 *
 * Google Cloud Speech-to-Text rejects WEBM_OPUS at 44.1kHz (the browser's
 * default mic rate) — it only accepts 8/12/16/24/48 kHz for Opus. Browser
 * `getUserMedia` constraints for sampleRate are widely ignored by hardware.
 * The reliable fix is to decode whatever the recorder produced and emit a
 * canonical PCM WAV at a rate STT accepts.
 *
 * Output: { blob, mimeType } where blob is a WAV with LINEAR16 PCM at 48kHz mono.
 */
export async function resampleToWav48k(input: Blob): Promise<{ blob: Blob; mimeType: string }> {
  const arrayBuffer = await input.arrayBuffer();

  // Decode via an OfflineAudioContext targeting our desired output rate, so
  // the browser resamples for us in one step.
  const TARGET_RATE = 48000;
  const decodeCtx = new AudioContext();
  let decoded: AudioBuffer;
  try {
    decoded = await decodeCtx.decodeAudioData(arrayBuffer.slice(0));
  } finally {
    decodeCtx.close().catch(() => {});
  }

  // Resample to TARGET_RATE mono via OfflineAudioContext.
  const durationSec = decoded.duration;
  const offline = new OfflineAudioContext(1, Math.ceil(durationSec * TARGET_RATE), TARGET_RATE);
  const src = offline.createBufferSource();
  src.buffer = decoded;
  src.connect(offline.destination);
  src.start(0);
  const rendered = await offline.startRendering();

  // Encode as 16-bit PCM WAV. rendered.length is the per-channel sample count.
  const pcm16 = floatToPcm16(rendered.getChannelData(0));
  const wav = buildWavBlob(pcm16, TARGET_RATE);
  return { blob: wav, mimeType: 'audio/wav' };
}

function floatToPcm16(input: Float32Array): Int16Array {
  const out = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return out;
}

function buildWavBlob(samples: Int16Array, sampleRate: number): Blob {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = samples.byteLength;

  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');

  // fmt subchunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true);  // format = 1 (PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // data subchunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // sample data (little-endian)
  const samplesView = new Int16Array(buffer, 44);
  samplesView.set(samples);

  return new Blob([buffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
}
