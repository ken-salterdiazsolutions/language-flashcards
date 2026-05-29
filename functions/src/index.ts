import { setGlobalOptions } from "firebase-functions";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { SpeechClient, protos } from "@google-cloud/speech";

setGlobalOptions({ maxInstances: 10 });

type Lang =
  | "japanese" | "korean" | "mandarin"
  | "spanish" | "french" | "german";

const VOICE_BY_LANG: Record<Lang, { languageCode: string; name: string }> = {
  japanese: { languageCode: "ja-JP", name: "ja-JP-Neural2-B" },
  korean: { languageCode: "ko-KR", name: "ko-KR-Neural2-A" },
  mandarin: { languageCode: "cmn-CN", name: "cmn-CN-Wavenet-A" },
  spanish: { languageCode: "es-ES", name: "es-ES-Neural2-A" },
  french: { languageCode: "fr-FR", name: "fr-FR-Neural2-A" },
  german: { languageCode: "de-DE", name: "de-DE-Neural2-A" },
};

const ttsClient = new TextToSpeechClient();
const sttClient = new SpeechClient();

// BCP-47 language codes for Speech-to-Text. Note: STT and TTS sometimes
// use different codes — Mandarin TTS uses "cmn-CN" but STT uses "zh-CN".
const STT_LANG_CODE: Record<Lang, string> = {
  japanese: "ja-JP",
  korean: "ko-KR",
  mandarin: "zh-CN",
  spanish: "es-ES",
  french: "fr-FR",
  german: "de-DE",
};

// Map frontend-reported MIME types to Google STT encoding enums. Browsers
// produce different formats: Chrome/Firefox → webm/opus, Safari → mp4/aac.
function pickEncoding(mimeType: string): protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding | null {
  const lower = mimeType.toLowerCase();
  if (lower.includes("webm")) return protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.WEBM_OPUS;
  if (lower.includes("ogg")) return protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.OGG_OPUS;
  if (lower.includes("mp4") || lower.includes("aac")) return protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.MP3; // fallback; works for many AAC streams via re-encoding
  if (lower.includes("wav") || lower.includes("linear")) return protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16;
  return null;
}

export const synthesizeSpeech = onCall(
  { region: "us-central1" },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Sign-in required.");
    }

    const { text, lang } = (request.data ?? {}) as { text?: string; lang?: Lang };
    if (!text || typeof text !== "string" || text.length > 200) {
      throw new HttpsError("invalid-argument", "Missing or invalid 'text'.");
    }
    if (!lang || !(lang in VOICE_BY_LANG)) {
      throw new HttpsError("invalid-argument", "Missing or invalid 'lang'.");
    }

    const voice = VOICE_BY_LANG[lang];
    const [response] = await ttsClient.synthesizeSpeech({
      input: { text },
      voice: { languageCode: voice.languageCode, name: voice.name },
      audioConfig: { audioEncoding: "MP3", speakingRate: 0.9 },
    });

    if (!response.audioContent) {
      throw new HttpsError("internal", "No audio returned from TTS.");
    }

    const audioBase64 =
      typeof response.audioContent === "string"
        ? response.audioContent
        : Buffer.from(response.audioContent).toString("base64");

    return { audioBase64, mimeType: "audio/mpeg" };
  },
);

const MAX_AUDIO_BYTES = 1_000_000; // ~1MB; well above what a ~10s clip needs

export const transcribeSpeech = onCall(
  { region: "us-central1" },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Sign-in required.");
    }

    const { audioBase64, lang, mimeType } = (request.data ?? {}) as {
      audioBase64?: string;
      lang?: Lang;
      mimeType?: string;
    };

    if (!audioBase64 || typeof audioBase64 !== "string") {
      throw new HttpsError("invalid-argument", "Missing 'audioBase64'.");
    }
    if (audioBase64.length > MAX_AUDIO_BYTES * 1.4) {
      // base64 inflates by ~33%; bound just in case
      throw new HttpsError("invalid-argument", "Audio too long.");
    }
    if (!lang || !(lang in STT_LANG_CODE)) {
      throw new HttpsError("invalid-argument", "Missing or invalid 'lang'.");
    }
    if (!mimeType || typeof mimeType !== "string") {
      throw new HttpsError("invalid-argument", "Missing 'mimeType'.");
    }

    const encoding = pickEncoding(mimeType);
    if (encoding === null) {
      throw new HttpsError("invalid-argument", `Unsupported audio MIME type: ${mimeType}`);
    }

    const languageCode = STT_LANG_CODE[lang];

    const [response] = await sttClient.recognize({
      audio: { content: audioBase64 },
      config: {
        encoding,
        // Most browser MediaRecorder outputs don't need explicit sampleRate.
        // STT auto-detects from the container for WEBM_OPUS / OGG_OPUS / MP3.
        languageCode,
        model: "latest_short",
        enableAutomaticPunctuation: false,
        maxAlternatives: 1,
      },
    });

    const result = response.results?.[0];
    const alt = result?.alternatives?.[0];
    return {
      transcript: alt?.transcript ?? "",
      confidence: alt?.confidence ?? 0,
    };
  },
);
