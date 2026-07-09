import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function initFirebase() {
  if (getApps().length > 0) {
    return getFirestore();
  }

  // For Vercel: use FIREBASE_SERVICE_ACCOUNT_KEY env var
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountKey) {
    const serviceAccount = JSON.parse(serviceAccountKey) as ServiceAccount;
    initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    // Fallback: Application Default Credentials (local dev with gcloud auth)
    initializeApp({
      projectId: "crystalscan-1858b",
    });
  }

  return getFirestore();
}

export const db = initFirebase();
