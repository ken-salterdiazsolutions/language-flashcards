import { setGlobalOptions } from "firebase-functions";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";

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

const client = new TextToSpeechClient();

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
    const [response] = await client.synthesizeSpeech({
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
