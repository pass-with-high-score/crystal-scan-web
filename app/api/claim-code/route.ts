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

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username || typeof username !== "string") {
      return Response.json(
        { error: "Vui lòng nhập Telegram username." },
        { status: 400 }
      );
    }

    // Normalize username: remove @ if present, trim
    const normalizedUsername = username.replace(/^@/, "").trim().toLowerCase();

    // Telegram username rules: 5-32 chars, a-z, 0-9, underscore, must start with a letter
    const telegramUsernameRegex = /^[a-z][a-z0-9_]{3,30}[a-z0-9]$/;
    if (!telegramUsernameRegex.test(normalizedUsername)) {
      return Response.json(
        {
          error:
            "Username Telegram không hợp lệ. Username phải từ 5-32 ký tự, chỉ gồm chữ cái, số và dấu gạch dưới, bắt đầu bằng chữ cái.",
        },
        { status: 400 }
      );
    }

    // Check if username already claimed (use username as document ID)
    const claimRef = db.collection(COLLECTION_NAME).doc(normalizedUsername);
    const claimDoc = await claimRef.get();

    if (claimDoc.exists) {
      return Response.json(
        {
          error: `Username @${normalizedUsername} đã nhận code rồi. Mỗi người chỉ được nhận 1 code.`,
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
        { error: "Rất tiếc, tất cả code đã được nhận hết!" },
        { status: 410 }
      );
    }

    // Assign the first available code
    const assignedCode = availableCodes[0];

    // Save claim to Firestore (use username as doc ID to prevent duplicates)
    await claimRef.set({
      username: normalizedUsername,
      code: assignedCode,
      claimedAt: new Date().toISOString(),
    });

    // Send Telegram notification (non-blocking)
    sendTelegramNotification(normalizedUsername, assignedCode).catch((err) =>
      console.error("Telegram notification failed:", err)
    );

    return Response.json({
      success: true,
      code: assignedCode,
      message: `Chúc mừng @${normalizedUsername}! Bạn đã nhận được code.`,
    });
  } catch (err) {
    console.error("Claim error:", err);
    return Response.json(
      { error: "Đã xảy ra lỗi. Vui lòng thử lại." },
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
