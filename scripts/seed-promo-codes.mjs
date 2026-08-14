// Import promotion codes from a CSV into the `promo_codes` Firestore collection.
//
// Usage:
//   node --env-file=.env.local scripts/seed-promo-codes.mjs "/path/to/promotion_codes.csv"
//
// Safe to re-run: codes that already exist are skipped, and codes already
// recorded in `promo_claims` are marked as claimed so they are never re-issued.

import { readFileSync } from "node:fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const CODES_COLLECTION = "promo_codes";
const CLAIMS_COLLECTION = "promo_claims";
const BATCH_LIMIT = 500;

const csvPath = process.argv[2];
if (!csvPath) {
  console.error("Usage: node --env-file=.env.local scripts/seed-promo-codes.mjs <csv-path>");
  process.exit(1);
}

function parseCodes(path) {
  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  const codes = lines
    .map((line) => line.split(",")[0].trim())
    .filter((code) => code.length > 0);

  // Drop the header row if present (e.g. "Promotion code")
  if (codes.length > 0 && !/^[A-Z0-9]{8,}$/i.test(codes[0])) {
    codes.shift();
  }

  return [...new Set(codes)];
}

function initFirebase() {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountKey) {
    const raw = JSON.parse(serviceAccountKey);
    initializeApp({
      credential: cert({
        projectId: raw.project_id,
        clientEmail: raw.client_email,
        privateKey: raw.private_key?.replace(/\\n/g, "\n"),
      }),
    });
  } else {
    // Application Default Credentials (local dev with gcloud auth)
    initializeApp({ projectId: "crystalscan-1858b" });
  }

  return getFirestore();
}

async function commitInBatches(db, items, apply) {
  for (let i = 0; i < items.length; i += BATCH_LIMIT) {
    const batch = db.batch();
    for (const item of items.slice(i, i + BATCH_LIMIT)) {
      apply(batch, item);
    }
    await batch.commit();
  }
}

const codes = parseCodes(csvPath);
console.log(`Parsed ${codes.length} unique codes from ${csvPath}`);

const db = initFirebase();
const codesRef = db.collection(CODES_COLLECTION);

const existingSnapshot = await codesRef.select().get();
const existing = new Set(existingSnapshot.docs.map((doc) => doc.id));
const newCodes = codes.filter((code) => !existing.has(code));

await commitInBatches(db, newCodes, (batch, code) => {
  batch.set(codesRef.doc(code), {
    code,
    claimed: false,
    claimedBy: null,
    claimedAt: null,
  });
});

console.log(`Inserted ${newCodes.length} new codes (${existing.size} already present)`);

// Reconcile with existing claims so previously handed-out codes stay claimed.
const claimsSnapshot = await db.collection(CLAIMS_COLLECTION).get();
const claims = claimsSnapshot.docs
  .map((doc) => ({ userId: doc.id, ...doc.data() }))
  .filter((claim) => typeof claim.code === "string" && claim.code.length > 0);

await commitInBatches(db, claims, (batch, claim) => {
  batch.set(
    codesRef.doc(claim.code),
    {
      code: claim.code,
      claimed: true,
      claimedBy: claim.userId,
      claimedAt: claim.claimedAt ?? null,
    },
    { merge: true }
  );
});

console.log(`Reconciled ${claims.length} existing claims`);

const total = (await codesRef.count().get()).data().count;
const claimed = (await codesRef.where("claimed", "==", true).count().get()).data().count;
console.log(`Done. total=${total} claimed=${claimed} remaining=${total - claimed}`);
