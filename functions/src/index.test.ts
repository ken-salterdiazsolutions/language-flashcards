import { describe, it, expect, beforeEach, vi } from "vitest";
import functionsTest from "firebase-functions-test";
import { protos } from "@google-cloud/speech";

const AudioEncoding = protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding;

// Mock fns are hoisted so the vi.mock factories below can reference them.
const { ttsSynth, sttRecognize } = vi.hoisted(() => ({
  ttsSynth: vi.fn(),
  sttRecognize: vi.fn(),
}));

// index.ts constructs both clients at module load, so the mocks must be in
// place before it is imported. vitest hoists vi.mock above the imports.
vi.mock("@google-cloud/text-to-speech", () => ({
  // Regular function (not arrow) so it can be invoked with `new`.
  TextToSpeechClient: vi.fn(function () {
    return { synthesizeSpeech: ttsSynth };
  }),
}));

// Preserve the real `protos` (enums/types) — only the SpeechClient is mocked.
vi.mock("@google-cloud/speech", async (importActual) => {
  const actual = await importActual<typeof import("@google-cloud/speech")>();
  return {
    ...actual,
    SpeechClient: vi.fn(function () {
      return { recognize: sttRecognize };
    }),
  };
});

const testEnv = functionsTest();

// Imported after the mocks are registered.
const { synthesizeSpeech, transcribeSpeech } = await import("./index.js");
const wrappedSynth = testEnv.wrap(synthesizeSpeech) as (req: any) => Promise<any>;
const wrappedTranscribe = testEnv.wrap(transcribeSpeech) as (req: any) => Promise<any>;

const auth = { uid: "test-user" };

beforeEach(() => {
  ttsSynth.mockReset();
  sttRecognize.mockReset();
});

describe("synthesizeSpeech", () => {
  it("rejects unauthenticated callers", async () => {
    await expect(
      wrappedSynth({ data: { text: "hola", lang: "spanish" }, auth: undefined }),
    ).rejects.toMatchObject({ code: "unauthenticated" });
    expect(ttsSynth).not.toHaveBeenCalled();
  });

  it("rejects missing or oversized text", async () => {
    await expect(
      wrappedSynth({ data: { lang: "spanish" }, auth }),
    ).rejects.toMatchObject({ code: "invalid-argument" });
    await expect(
      wrappedSynth({ data: { text: "x".repeat(201), lang: "spanish" }, auth }),
    ).rejects.toMatchObject({ code: "invalid-argument" });
    expect(ttsSynth).not.toHaveBeenCalled();
  });

  it("rejects an unknown language", async () => {
    await expect(
      wrappedSynth({ data: { text: "hi", lang: "klingon" }, auth }),
    ).rejects.toMatchObject({ code: "invalid-argument" });
  });

  it("synthesizes with the per-language voice and returns base64 MP3", async () => {
    ttsSynth.mockResolvedValue([{ audioContent: Buffer.from("fake-mp3-bytes") }]);

    const result = await wrappedSynth({
      data: { text: "bonjour", lang: "french" },
      auth,
    });

    expect(ttsSynth).toHaveBeenCalledWith({
      input: { text: "bonjour" },
      voice: { languageCode: "fr-FR", name: "fr-FR-Neural2-A" },
      audioConfig: { audioEncoding: "MP3", speakingRate: 0.9 },
    });
    expect(result).toEqual({
      audioBase64: Buffer.from("fake-mp3-bytes").toString("base64"),
      mimeType: "audio/mpeg",
    });
  });

  it("passes through audioContent already given as a base64 string", async () => {
    ttsSynth.mockResolvedValue([{ audioContent: "already-base64" }]);

    const result = await wrappedSynth({
      data: { text: "hallo", lang: "german" },
      auth,
    });

    expect(result.audioBase64).toBe("already-base64");
  });

  it("throws internal when TTS returns no audio", async () => {
    ttsSynth.mockResolvedValue([{ audioContent: null }]);

    await expect(
      wrappedSynth({ data: { text: "ciao", lang: "italian" }, auth }),
    ).rejects.toMatchObject({ code: "internal" });
  });
});

describe("transcribeSpeech", () => {
  const okData = {
    audioBase64: "AAAA",
    lang: "spanish",
    mimeType: "audio/webm",
  };

  it("rejects unauthenticated callers", async () => {
    await expect(
      wrappedTranscribe({ data: okData, auth: undefined }),
    ).rejects.toMatchObject({ code: "unauthenticated" });
    expect(sttRecognize).not.toHaveBeenCalled();
  });

  it("validates audioBase64, length, lang, and mimeType", async () => {
    await expect(
      wrappedTranscribe({ data: { ...okData, audioBase64: undefined }, auth }),
    ).rejects.toMatchObject({ code: "invalid-argument" });

    await expect(
      wrappedTranscribe({ data: { ...okData, audioBase64: "x".repeat(1_400_001) }, auth }),
    ).rejects.toMatchObject({ code: "invalid-argument" });

    await expect(
      wrappedTranscribe({ data: { ...okData, lang: "klingon" }, auth }),
    ).rejects.toMatchObject({ code: "invalid-argument" });

    await expect(
      wrappedTranscribe({ data: { ...okData, mimeType: undefined }, auth }),
    ).rejects.toMatchObject({ code: "invalid-argument" });

    expect(sttRecognize).not.toHaveBeenCalled();
  });

  it("rejects an unsupported MIME type", async () => {
    await expect(
      wrappedTranscribe({ data: { ...okData, mimeType: "audio/flac" }, auth }),
    ).rejects.toMatchObject({ code: "invalid-argument" });
    expect(sttRecognize).not.toHaveBeenCalled();
  });

  it("recognizes webm without an explicit sample rate and returns the alternative", async () => {
    sttRecognize.mockResolvedValue([
      { results: [{ alternatives: [{ transcript: "hola", confidence: 0.93 }] }] },
    ]);

    const result = await wrappedTranscribe({ data: okData, auth });

    expect(sttRecognize).toHaveBeenCalledTimes(1);
    const arg = sttRecognize.mock.calls[0][0];
    expect(arg.audio).toEqual({ content: "AAAA" });
    expect(arg.config.encoding).toBe(AudioEncoding.WEBM_OPUS);
    expect(arg.config.languageCode).toBe("es-ES");
    expect(arg.config).not.toHaveProperty("sampleRateHertz");
    expect(result).toEqual({ transcript: "hola", confidence: 0.93 });
  });

  it("sets sampleRateHertz=48000 for LINEAR16 (wav) audio", async () => {
    sttRecognize.mockResolvedValue([
      { results: [{ alternatives: [{ transcript: "ja", confidence: 0.8 }] }] },
    ]);

    await wrappedTranscribe({
      data: { ...okData, mimeType: "audio/wav", lang: "german" },
      auth,
    });

    const arg = sttRecognize.mock.calls[0][0];
    expect(arg.config.encoding).toBe(AudioEncoding.LINEAR16);
    expect(arg.config.sampleRateHertz).toBe(48000);
  });

  it("maps Mandarin to the STT-specific zh-CN code", async () => {
    sttRecognize.mockResolvedValue([{ results: [] }]);

    await wrappedTranscribe({ data: { ...okData, lang: "mandarin" }, auth });

    expect(sttRecognize.mock.calls[0][0].config.languageCode).toBe("zh-CN");
  });

  it("returns empty transcript / zero confidence when STT finds nothing", async () => {
    sttRecognize.mockResolvedValue([{ results: [] }]);

    const result = await wrappedTranscribe({ data: okData, auth });

    expect(result).toEqual({ transcript: "", confidence: 0 });
  });
});
