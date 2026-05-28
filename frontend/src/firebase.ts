import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";

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
const auth = getAuth(app);
const functions = getFunctions(app, "us-central1");

let signInPromise: Promise<unknown> | null = null;
export function ensureSignedIn() {
  if (auth.currentUser) return Promise.resolve();
  if (!signInPromise) signInPromise = signInAnonymously(auth);
  return signInPromise;
}

export const synthesizeSpeech = httpsCallable<
  { text: string; lang: "japanese" | "korean" | "mandarin" },
  { audioBase64: string; mimeType: string }
>(functions, "synthesizeSpeech");
