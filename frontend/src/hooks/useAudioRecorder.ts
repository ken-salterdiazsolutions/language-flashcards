import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Records audio from the mic via MediaRecorder. Auto-stops on silence
 * (RMS below SILENCE_THRESHOLD for SILENCE_HOLD_MS) or at HARD_CAP_MS.
 *
 * Usage:
 *   const { start, stop, isRecording, error } = useAudioRecorder();
 *   start(({ blob, mimeType }) => { ... upload ... });
 */

const SILENCE_THRESHOLD = 0.012;  // RMS amplitude (0–1) below this = "silent"
const SILENCE_HOLD_MS = 1500;     // need this much continuous silence to auto-stop
const MIN_AUDIO_MS = 1500;        // don't auto-stop until at least this much was recorded
const HARD_CAP_MS = 10_000;       // safety cap

type Result = { blob: Blob; mimeType: string };

type State = {
  isRecording: boolean;
  error: string | null;
};

export function useAudioRecorder() {
  const [state, setState] = useState<State>({ isRecording: false, error: null });

  // Refs for resources that need to be torn down between records
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const silenceStartedAtRef = useRef<number | null>(null);
  const recordingStartedAtRef = useRef<number | null>(null);
  const hardCapTimerRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const callbackRef = useRef<((r: Result) => void) | null>(null);

  const teardown = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (hardCapTimerRef.current !== null) clearTimeout(hardCapTimerRef.current);
    hardCapTimerRef.current = null;
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }
    audioContextRef.current = null;
    analyserRef.current = null;
    silenceStartedAtRef.current = null;
    recordingStartedAtRef.current = null;
    mediaRecorderRef.current = null;
    chunksRef.current = [];
  }, []);

  // Cleanup on unmount
  useEffect(() => teardown, [teardown]);

  const stop = useCallback(() => {
    const rec = mediaRecorderRef.current;
    if (rec && rec.state === 'recording') {
      rec.stop();
    }
  }, []);

  const start = useCallback(async (onComplete: (r: Result) => void) => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      return; // already recording
    }
    setState({ isRecording: true, error: null });
    callbackRef.current = onComplete;
    chunksRef.current = [];

    try {
      // We don't constrain sampleRate here — browsers ignore that constraint
      // anyway. The recorded blob is resampled to 48kHz mono WAV before
      // upload via resampleToWav48k() in audioConvert.ts.
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Pick the first MIME type the browser supports. Order matters:
      // try the formats Google STT handles best first.
      const mimeCandidates = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
      ];
      const mimeType = mimeCandidates.find(m => MediaRecorder.isTypeSupported(m)) ?? '';
      const rec = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = rec;

      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const finalMime = rec.mimeType || mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: finalMime });
        teardown();
        setState({ isRecording: false, error: null });
        callbackRef.current?.({ blob, mimeType: finalMime });
        callbackRef.current = null;
      };
      rec.onerror = () => {
        teardown();
        setState({ isRecording: false, error: 'Recorder error' });
        callbackRef.current = null;
      };

      // Set up silence detection on the live mic stream
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      analyserRef.current = analyser;

      const buffer = new Float32Array(analyser.fftSize);
      recordingStartedAtRef.current = performance.now();

      const tick = () => {
        const a = analyserRef.current;
        if (!a) return;
        a.getFloatTimeDomainData(buffer);
        // RMS amplitude
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) sum += buffer[i] * buffer[i];
        const rms = Math.sqrt(sum / buffer.length);
        const now = performance.now();
        const startedAt = recordingStartedAtRef.current ?? now;
        const elapsed = now - startedAt;

        if (rms < SILENCE_THRESHOLD) {
          if (silenceStartedAtRef.current === null) silenceStartedAtRef.current = now;
          const silentFor = now - silenceStartedAtRef.current;
          if (silentFor >= SILENCE_HOLD_MS && elapsed >= MIN_AUDIO_MS) {
            stop();
            return;
          }
        } else {
          silenceStartedAtRef.current = null;
        }
        rafRef.current = requestAnimationFrame(tick);
      };

      // Hard cap as final safety net
      hardCapTimerRef.current = window.setTimeout(() => stop(), HARD_CAP_MS);

      rec.start();
      rafRef.current = requestAnimationFrame(tick);
    } catch (err) {
      teardown();
      const message = err instanceof Error ? err.message : 'Recording failed';
      setState({ isRecording: false, error: message });
      callbackRef.current = null;
    }
  }, [stop, teardown]);

  return {
    start,
    stop,
    isRecording: state.isRecording,
    error: state.error,
  };
}
