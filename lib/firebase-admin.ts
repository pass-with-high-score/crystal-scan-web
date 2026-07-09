import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function initFirebase() {
  if (getApps().length > 0) {
    return getFirestore();
  }

  // For Vercel: use FIREBASE_SERVICE_ACCOUNT_KEY env var
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountKey) {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey) as ServiceAccount;
      // Vercel env vars sometimes escape newlines as literal '\n' strings. 
      // We must convert them back to actual newline characters for OpenSSL to read the PEM key.
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
      }
      initializeApp({
        credential: cert(serviceAccount),
      });
    } catch (error) {
      console.error("Firebase Admin Init Error:", error);
      // Fallback for build time if JSON is malformed
    }
  } else {
    // Fallback: Application Default Credentials (local dev with gcloud auth)
    initializeApp({
      projectId: "crystalscan-1858b",
    });
  }

  return getFirestore();
}

export const db = initFirebase();
