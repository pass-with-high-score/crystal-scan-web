"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Scan, Palette, History, Check, Menu, X } from "lucide-react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-4 left-4 right-4 mx-auto max-w-7xl bg-background/80 backdrop-blur-lg z-50 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <Image src="/icon.png" alt="Crystal Scan Icon" width={32} height={32} className="rounded-lg" />
            <span className="font-bold text-xl tracking-tight">Crystal Scan</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <a href="#features" className="hover:text-foreground transition-colors duration-200">Features</a>
            <a href="#design" className="hover:text-foreground transition-colors duration-200">Design</a>
            <Link href="/tester" className="bg-foreground text-background px-5 py-2 rounded-full hover:opacity-90 transition-all active:scale-95">Download Now</Link>
          </div>
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-foreground transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`md:hidden fixed top-24 left-4 right-4 bg-background border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-6 transition-all duration-300 z-[60] ${isMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
          <div className="flex flex-col gap-6">
            <a 
              href="#features" 
              onClick={toggleMenu}
              className="text-lg font-semibold text-zinc-600 dark:text-zinc-400 hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a 
              href="#design" 
              onClick={toggleMenu}
              className="text-lg font-semibold text-zinc-600 dark:text-zinc-400 hover:text-foreground transition-colors"
            >
              Design
            </a>
            <hr className="border-zinc-100 dark:border-zinc-800" />
            <Link 
              href="/tester" 
              onClick={toggleMenu}
              className="bg-foreground text-background py-4 rounded-xl font-bold text-center hover:opacity-90 transition-all active:scale-95"
            >
              Download Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-12 md:pt-48 md:pb-24 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">
            <span>New: Custom Design Studio</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl leading-[1.1]">
            Scanning Reimagined with <span className="text-blue-600">Crystal Precision.</span>
          </h1>
          <p className="text-base md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mb-10 leading-relaxed px-2">
            Fast and reliable QR & Barcode scanner with built-in design tools to create, customize, and organize your digital world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full sm:w-auto px-4 sm:px-0">
            <Link href="/tester" className="h-14 px-8 flex items-center justify-center bg-foreground text-background rounded-2xl font-semibold text-lg hover:scale-105 active:scale-95 transition-all">
              Get Started for Free
            </Link>
            <a href="#features" className="h-14 px-8 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 rounded-2xl font-semibold text-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">
              Explore Features
            </a>
          </div>
          <div className="mt-12 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 relative aspect-[1024/500]">
            <Image src="/featureGraphic.png" alt="Crystal Scan Feature Graphic" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto italic">Everything you need for scanning and organization.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                <Scan className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fast Scanner</h3>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Reliable detection for QR and Barcodes. Batch mode support for quick multi-scans.
              </p>
            </div>
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Design Studio</h3>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Generate custom QR codes with colors, logos, and unique styles that stand out.
              </p>
            </div>
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                <History className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Organized History</h3>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Keep all scans secure. Group into folders and export data to CSV effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section id="design" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            <div className="flex-1 space-y-6 md:space-y-8 text-center md:text-left">
              <h2 className="text-3xl md:text-6xl font-bold tracking-tight leading-tight">Beautifully Crafted for <span className="text-blue-600">Material You.</span></h2>
              <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Experience a modern interface that adapts to your system theme. Designed with focus on usability and aesthetics.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {['Modern Design', 'Privacy Focused', 'Ad-Free Experience', 'Smart Reminders', 'App Shortcuts', 'Global Access'].map((item) => (
                  <li key={item} className="flex items-center gap-3 font-semibold">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className={`relative aspect-[9/19] rounded-2xl overflow-hidden shadow-xl border border-zinc-100 dark:border-zinc-800 transition-transform hover:-translate-y-2 ${[3, 6].includes(num) ? 'hidden sm:block' : ''}`}>
                  <Image 
                    src={`/screenshots/${num}.jpg`} 
                    alt={`Screenshot ${num}`} 
                    fill 
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="download" className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto bg-zinc-900 dark:bg-zinc-800 rounded-[2rem] md:rounded-[3rem] p-8 md:p-24 text-center text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.2),transparent_50%)]"></div>
          <h2 className="text-3xl md:text-6xl font-bold mb-6 md:mb-8 relative z-10">Download Crystal Scan Today</h2>
          <p className="text-zinc-400 text-base md:text-xl mb-10 md:mb-12 max-w-2xl mx-auto relative z-10">
            Join thousands of users who trust Crystal Scan for their daily utility needs. Fast, secure, and beautiful.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 relative z-10">
            <Link href="/tester" className="bg-white text-black px-8 md:px-10 py-4 md:py-5 rounded-2xl font-bold text-lg md:text-xl hover:bg-zinc-100 transition-all flex items-center justify-center gap-3">
              Join Closed Testing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
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
