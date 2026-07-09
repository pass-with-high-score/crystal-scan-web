"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Gift, Copy, CheckCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react";

interface StatsData {
  total: number;
  claimed: number;
  remaining: number;
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

declare global {
  interface Window {
    onTelegramAuth: (user: TelegramUser) => void;
  }
}

export default function PromoPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [claimedCode, setClaimedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isAlreadyClaimed, setIsAlreadyClaimed] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    window.onTelegramAuth = (user: TelegramUser) => {
      handleClaimWithTelegram(user);
    };

    if (containerRef.current && !containerRef.current.firstChild) {
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.setAttribute("data-telegram-login", "grabifyz_bot");
      script.setAttribute("data-size", "large");
      script.setAttribute("data-onauth", "onTelegramAuth(user)");
      script.setAttribute("data-request-access", "write");
      script.async = true;
      containerRef.current.appendChild(script);
    }
  }, []);

  useEffect(() => {
    // Target date: Sunday, July 12, 2026, 23:59:59 (Indochina Time)
    const targetDate = new Date("2026-07-12T23:59:59+07:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/claim-code");
      const data = await res.json();
      setStats(data);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleClaimWithTelegram = async (user: TelegramUser) => {
    setIsLoading(true);
    setError(null);
    setClaimedCode(null);
    setIsAlreadyClaimed(false);

    try {
      const res = await fetch("/api/claim-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409 && data.alreadyClaimed && data.code) {
          setClaimedCode(data.code);
          setIsAlreadyClaimed(true);
          fetchStats();
        } else {
          setError(data.error);
        }
        return;
      }

      setClaimedCode(data.code);
      fetchStats();
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (claimedCode) {
      await navigator.clipboard.writeText(claimedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const progressPercent = stats
    ? Math.round((stats.claimed / stats.total) * 100)
    : 0;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Navigation - same style as landing page */}
      <nav className="fixed top-4 left-4 right-4 mx-auto max-w-7xl bg-background/80 backdrop-blur-lg z-50 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-foreground group-hover:-translate-x-1 transition-all" />
            <Image src="/icon.png" alt="Crystal Scan Icon" width={32} height={32} className="rounded-lg" />
            <span className="font-bold text-xl tracking-tight">Crystal Scan</span>
          </Link>
          {stats && (
            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              <span className="text-blue-600 dark:text-blue-400 font-bold">{stats.remaining}</span> codes remaining
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-16 md:pt-40 md:pb-24 px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">
              <Gift className="w-3.5 h-3.5" />
              <span>Limited Promotion</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Claim <span className="text-blue-600">Promotion Code</span>
            </h1>
            <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
              Enter your Telegram username to claim a free promo code for Crystal Scan Pro.
            </p>
          </div>

          {/* Countdown */}
          {timeLeft && (
            <div className="flex justify-center gap-2 sm:gap-3 mb-8">
              <div className="flex flex-col items-center p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl min-w-[60px] sm:min-w-[70px] shadow-sm">
                <span className="text-xl sm:text-2xl font-bold text-foreground">{timeLeft.days}</span>
                <span className="text-[9px] sm:text-[10px] uppercase text-zinc-500 font-semibold tracking-wider mt-0.5">Days</span>
              </div>
              <div className="flex flex-col items-center justify-center font-bold text-zinc-300 dark:text-zinc-700">:</div>
              <div className="flex flex-col items-center p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl min-w-[60px] sm:min-w-[70px] shadow-sm">
                <span className="text-xl sm:text-2xl font-bold text-foreground">{timeLeft.hours.toString().padStart(2, "0")}</span>
                <span className="text-[9px] sm:text-[10px] uppercase text-zinc-500 font-semibold tracking-wider mt-0.5">Hours</span>
              </div>
              <div className="flex flex-col items-center justify-center font-bold text-zinc-300 dark:text-zinc-700">:</div>
              <div className="flex flex-col items-center p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl min-w-[60px] sm:min-w-[70px] shadow-sm">
                <span className="text-xl sm:text-2xl font-bold text-foreground">{timeLeft.minutes.toString().padStart(2, "0")}</span>
                <span className="text-[9px] sm:text-[10px] uppercase text-zinc-500 font-semibold tracking-wider mt-0.5">Mins</span>
              </div>
              <div className="flex flex-col items-center justify-center font-bold text-zinc-300 dark:text-zinc-700">:</div>
              <div className="flex flex-col items-center p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl min-w-[60px] sm:min-w-[70px] shadow-sm">
                <span className="text-xl sm:text-2xl font-bold text-foreground">{timeLeft.seconds.toString().padStart(2, "0")}</span>
                <span className="text-[9px] sm:text-[10px] uppercase text-zinc-500 font-semibold tracking-wider mt-0.5">Secs</span>
              </div>
            </div>
          )}

          {/* Progress bar */}
          {stats && stats.total > 0 && (
            <div className="mb-6 px-1">
              <div className="flex justify-between text-xs text-zinc-400 dark:text-zinc-500 mb-2 font-medium">
                <span>Claimed: {stats.claimed}/{stats.total}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Card - matches landing page card style */}
          <div className="bg-background p-6 sm:p-8 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
            {!claimedCode ? (
              <>
                {/* Error */}
                {error && (
                  <div className="mb-6 flex items-start gap-2.5 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Telegram Widget Container */}
                <div className="flex flex-col items-center justify-center min-h-[100px]">
                  {isLoading ? (
                    <div className="flex flex-col items-center text-zinc-500">
                      <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" />
                      <p className="text-sm font-medium">Processing your claim...</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 text-center font-medium">
                        Log in with Telegram to securely claim your code.
                      </p>
                      <div ref={containerRef} className="flex justify-center scale-110 origin-center transition-transform" />
                    </>
                  )}
                </div>

                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 text-center mt-6 leading-relaxed">
                  Each Telegram account can only claim one code.
                </p>
              </>
            ) : (
              /* Success state */
              <div className="text-center py-2">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-xl font-bold mb-2">
                  {isAlreadyClaimed ? "Welcome back! 🌟" : "Congratulations! 🎉"}
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
                  {isAlreadyClaimed
                    ? "Here is your previously claimed code. You can redeem it on Google Play."
                    : "Your code is ready. Please copy and redeem it on Google Play."}
                </p>

                {/* Code display */}
                <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 mb-5">
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium uppercase tracking-wider mb-2">
                    Promotion Code
                  </p>
                  <p className="font-mono text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 tracking-widest break-all select-all">
                    {claimedCode}
                  </p>
                </div>

                {/* Copy button - outlined style like landing page secondary button */}
                <button
                  onClick={copyToClipboard}
                  className="w-full h-11 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all active:scale-[0.98] cursor-pointer"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Code
                    </>
                  )}
                </button>

                {/* Redeem link */}
                <a
                  href="https://play.google.com/redeem"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-4 text-xs text-blue-600 dark:text-blue-400 hover:underline transition-colors font-medium"
                >
                  Redeem code on Google Play →
                </a>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer - same as landing page */}
      <footer className="py-12 border-t border-zinc-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Image src="/icon.png" alt="Crystal Scan Icon" width={24} height={24} className="rounded-md" />
            <span className="font-bold text-lg tracking-tight">Crystal Scan</span>
          </div>
          <div className="flex gap-8 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <a href="mailto:nguyenquangminh570@gmail.com" className="hover:text-foreground transition-colors">Support</a>
          </div>
          <p className="text-sm text-zinc-400">
            © 2026 Crystal Scan. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
