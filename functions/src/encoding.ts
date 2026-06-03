import { protos } from "@google-cloud/speech";

type AudioEncoding =
  protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding;

// Map frontend-reported MIME types to Google STT encoding enums. Browsers
// produce different formats: Chrome/Firefox → webm/opus, Safari → mp4/aac.
export function pickEncoding(mimeType: string): AudioEncoding | null {
  const lower = mimeType.toLowerCase();
  if (lower.includes("webm")) return protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.WEBM_OPUS;
  if (lower.includes("ogg")) return protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.OGG_OPUS;
  if (lower.includes("mp4") || lower.includes("aac")) return protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.MP3; // fallback; works for many AAC streams via re-encoding
  if (lower.includes("wav") || lower.includes("linear")) return protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16;
  return null;
}
