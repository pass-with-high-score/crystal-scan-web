import { NextRequest } from "next/server";
import { db } from "@/lib/firebase-admin";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

// All promotion codes
const PROMO_CODES = process.env.PROMOTION_CODES
  ? process.env.PROMOTION_CODES.split(",").map((code) => code.trim()).filter((code) => code.length > 0)
  : [];

// Force dynamic to avoid caching
export const dynamic = "force-dynamic";

const COLLECTION_NAME = "promo_claims";

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

    // Check if user already claimed (use Telegram ID as document ID)
    const claimRef = db.collection(COLLECTION_NAME).doc(userId);
    const claimDoc = await claimRef.get();

    if (claimDoc.exists) {
      return Response.json(
        {
          error: `You have already claimed a code. Each person can only claim one code.`,
          alreadyClaimed: true,
        },
        { status: 409 }
      );
    }

    // Get all claimed codes
    const claimsSnapshot = await db.collection(COLLECTION_NAME).get();
    const claimedCodes = new Set(
      claimsSnapshot.docs.map((doc) => doc.data().code as string)
    );

    // Find unclaimed codes
    const availableCodes = PROMO_CODES.filter(
      (code) => !claimedCodes.has(code)
    );

    if (availableCodes.length === 0) {
      return Response.json(
        { error: "Sorry, all codes have been claimed!" },
        { status: 410 }
      );
    }

    // Assign the first available code
    const assignedCode = availableCodes[0];

    // Save claim to Firestore
    await claimRef.set({
      userId: userId,
      username: userData.username || null,
      firstName: userData.first_name || null,
      code: assignedCode,
      claimedAt: new Date().toISOString(),
    });

    // Send Telegram notification (non-blocking)
    sendTelegramNotification(displayUsername, assignedCode).catch((err) =>
      console.error("Telegram notification failed:", err)
    );

    return Response.json({
      success: true,
      code: assignedCode,
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
    const claimsSnapshot = await db.collection(COLLECTION_NAME).get();
    const claimed = claimsSnapshot.size;

    return Response.json({
      total: PROMO_CODES.length,
      claimed,
      remaining: Math.max(0, PROMO_CODES.length - claimed),
    });
  } catch {
    return Response.json({
      total: PROMO_CODES.length,
      claimed: 0,
      remaining: PROMO_CODES.length,
    });
  }
}
