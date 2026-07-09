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
      const raw = JSON.parse(serviceAccountKey);
      
      const serviceAccount: ServiceAccount = {
        projectId: raw.project_id,
        clientEmail: raw.client_email,
        privateKey: raw.private_key?.replace(/\\n/g, "\n"),
      };
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
