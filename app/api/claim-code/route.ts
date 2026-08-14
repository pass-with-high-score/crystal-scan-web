import { NextRequest } from "next/server";
import { db } from "@/lib/firebase-admin";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

// Force dynamic to avoid caching
export const dynamic = "force-dynamic";

// Per-user claim records, keyed by Telegram user id
const COLLECTION_NAME = "promo_claims";
// The pool of promotion codes, keyed by the code itself.
// Seed it with: node --env-file=.env.local scripts/seed-promo-codes.mjs <csv>
const CODES_COLLECTION = "promo_codes";

type ClaimResult =
  | { status: "claimed"; code: string }
  | { status: "already"; code?: string }
  | { status: "soldOut" };

async function sendTelegramNotification(
  username: string,
  code: string
): Promise<void> {
  const now = new Date().toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
  const message =
    `🎉 *Promotion Code Claimed!*\n\n` +
    `👤 *Telegram:* @${username}\n` +
    `🎟️ *Code:* \`${code}\`\n` +
    `🕐 *Time:* ${now}`;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "Markdown",
    }),
  });
}

import crypto from "crypto";

function checkTelegramAuth(data: any, botToken: string): boolean {
  if (!data || !data.hash) {
    console.error("Missing data or hash");
    return false;
  }
  
  const { hash, ...userData } = data;
  
  const dataCheckArr = [];
  for (const key of Object.keys(userData).sort()) {
    if (userData[key] !== undefined && userData[key] !== null) {
      dataCheckArr.push(`${key}=${userData[key]}`);
    }
  }
  const dataCheckString = dataCheckArr.join("\n");
  console.log("dataCheckString:", dataCheckString);
  
  const token = botToken.trim();
  console.log("Token prefix:", token.substring(0, 5));
  const secretKey = crypto.createHash("sha256").update(token).digest();
  const hmac = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");
  
  console.log("Calculated HMAC:", hmac);
  console.log("Provided Hash:", hash);
  
  if (userData.auth_date) {
    const now = Math.floor(Date.now() / 1000);
    if (now - userData.auth_date > 86400) { // 24 hours just in case
      console.error("Auth date too old");
      return false;
    }
  }
  
  return hmac === hash;
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();

    if (!checkTelegramAuth(userData, BOT_TOKEN)) {
      return Response.json(
        { error: "Invalid Telegram authentication." },
        { status: 401 }
      );
    }

    const userId = userData.id.toString();
    const displayUsername = userData.username || userData.first_name || userId;

    // Claim record uses the Telegram ID as document ID
    const claimRef = db.collection(COLLECTION_NAME).doc(userId);
    const claimedAt = new Date().toISOString();

    // Reserve a code atomically so two concurrent claims can never share one
    const result = await db.runTransaction<ClaimResult>(async (tx) => {
      const claimDoc = await tx.get(claimRef);
      if (claimDoc.exists) {
        return { status: "already", code: claimDoc.data()?.code };
      }

      const available = await tx.get(
        db.collection(CODES_COLLECTION).where("claimed", "==", false).limit(1)
      );
      if (available.empty) {
        return { status: "soldOut" };
      }

      const codeDoc = available.docs[0];

      tx.update(codeDoc.ref, {
        claimed: true,
        claimedBy: userId,
        claimedAt,
      });

      tx.set(claimRef, {
        userId: userId,
        username: userData.username || null,
        firstName: userData.first_name || null,
        code: codeDoc.id,
        claimedAt,
      });

      return { status: "claimed", code: codeDoc.id };
    });

    if (result.status === "already") {
      return Response.json(
        {
          error: `Welcome back! Here is your previously claimed code.`,
          alreadyClaimed: true,
          code: result.code,
        },
        { status: 409 }
      );
    }

    if (result.status === "soldOut") {
      return Response.json(
        { error: "Sorry, all codes have been claimed!" },
        { status: 410 }
      );
    }

    // Send Telegram notification (non-blocking)
    sendTelegramNotification(displayUsername, result.code).catch((err) =>
      console.error("Telegram notification failed:", err)
    );

    return Response.json({
      success: true,
      code: result.code,
      message: `Congratulations! You have successfully claimed a code.`,
    });
  } catch (err: any) {
    console.error("Claim error:", err);
    return Response.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const codesRef = db.collection(CODES_COLLECTION);
    const [totalSnapshot, claimedSnapshot] = await Promise.all([
      codesRef.count().get(),
      codesRef.where("claimed", "==", true).count().get(),
    ]);

    const total = totalSnapshot.data().count;
    const claimed = claimedSnapshot.data().count;

    return Response.json({
      total,
      claimed,
      remaining: Math.max(0, total - claimed),
    });
  } catch (err) {
    console.error("Stats error:", err);
    return Response.json({ total: 0, claimed: 0, remaining: 0 });
  }
}
