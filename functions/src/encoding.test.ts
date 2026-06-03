import { describe, it, expect } from "vitest";
import { protos } from "@google-cloud/speech";
import { pickEncoding } from "./encoding.js";

const AudioEncoding = protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding;

describe("pickEncoding", () => {
  it("maps webm (Chrome/Firefox) to WEBM_OPUS", () => {
    expect(pickEncoding("audio/webm")).toBe(AudioEncoding.WEBM_OPUS);
    expect(pickEncoding("audio/webm;codecs=opus")).toBe(AudioEncoding.WEBM_OPUS);
  });

  it("maps ogg to OGG_OPUS", () => {
    expect(pickEncoding("audio/ogg")).toBe(AudioEncoding.OGG_OPUS);
    expect(pickEncoding("audio/ogg;codecs=opus")).toBe(AudioEncoding.OGG_OPUS);
  });

  it("maps mp4/aac (Safari) to MP3 fallback", () => {
    expect(pickEncoding("audio/mp4")).toBe(AudioEncoding.MP3);
    expect(pickEncoding("audio/aac")).toBe(AudioEncoding.MP3);
    expect(pickEncoding("audio/mp4;codecs=mp4a.40.2")).toBe(AudioEncoding.MP3);
  });

  it("maps wav/linear to LINEAR16", () => {
    expect(pickEncoding("audio/wav")).toBe(AudioEncoding.LINEAR16);
    expect(pickEncoding("audio/x-wav")).toBe(AudioEncoding.LINEAR16);
    expect(pickEncoding("audio/linear16")).toBe(AudioEncoding.LINEAR16);
  });

  it("is case-insensitive", () => {
    expect(pickEncoding("AUDIO/WEBM")).toBe(AudioEncoding.WEBM_OPUS);
    expect(pickEncoding("Audio/MP4")).toBe(AudioEncoding.MP3);
  });

  it("returns null for unsupported / unknown MIME types", () => {
    expect(pickEncoding("audio/flac")).toBeNull();
    expect(pickEncoding("application/octet-stream")).toBeNull();
    expect(pickEncoding("")).toBeNull();
  });

  it("checks webm before ogg when both appear in the string", () => {
    // webm is matched first; a contrived type containing both resolves to WEBM_OPUS
    expect(pickEncoding("audio/webm-ogg")).toBe(AudioEncoding.WEBM_OPUS);
  });
});
