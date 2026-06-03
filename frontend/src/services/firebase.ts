import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import type { Lang } from "../models/data";

const firebaseConfig = {
  apiKey: "AIzaSyC_fhwdcbTQ-rLiYw6fEkBxcqJvu6Db2q8",
  authDomain: "language-flashcards-b282d.firebaseapp.com",
  projectId: "language-flashcards-b282d",
  storageBucket: "language-flashcards-b282d.firebasestorage.app",
  messagingSenderId: "1015561580109",
  appId: "1:1015561580109:web:43300240aa359a91d1b604",
  measurementId: "G-H8LJM26L8V",
};

const app = initializeApp(firebaseConfig);

// App Check (reCAPTCHA v3) attests requests come from the real app, so the
// Cloud Functions can reject traffic that isn't from this site. The site key
// is public by design (it ships in the client bundle, like the API key above).
// In dev, enable a debug token so localhost works without reCAPTCHA — the token
// prints to the console on first run; register it under App Check → Apps →
// Manage debug tokens.
if (import.meta.env.DEV) {
  (self as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean }).FIREBASE_APPCHECK_DEBUG_TOKEN =
    true;
}

initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6LeR_AotAAAAAP_J6uE4OPfOyNym2Cns8esVaLa0"),
  isTokenAutoRefreshEnabled: true,
});

const auth = getAuth(app);
const functions = getFunctions(app, "us-central1");

let signInPromise: Promise<unknown> | null = null;
export function ensureSignedIn() {
  if (auth.currentUser) return Promise.resolve();
  if (!signInPromise) signInPromise = signInAnonymously(auth);
  return signInPromise;
}

export const synthesizeSpeech = httpsCallable<
  { text: string; lang: Lang },
  { audioBase64: string; mimeType: string }
>(functions, "synthesizeSpeech");

export const transcribeSpeech = httpsCallable<
  { audioBase64: string; mimeType: string; lang: Lang },
  { transcript: string; confidence: number }
>(functions, "transcribeSpeech");
