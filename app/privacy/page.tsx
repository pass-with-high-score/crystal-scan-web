import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-4xl mx-auto py-12 px-6">
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline mb-8 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-4">Last Updated: June 21, 2026</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Crystal Scan ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Data Collection</h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
            <strong>Privacy Focused:</strong> As stated in our app description, we focus on privacy. We do not perform unnecessary tracking or data collection.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li><strong>Local Storage:</strong> All your scan history and generated QR codes are stored locally on your device.</li>
            <li><strong>Camera Access:</strong> We require camera access solely for the purpose of scanning QR codes and Barcodes.</li>
            <li><strong>Gallery Access:</strong> We require gallery access only when you choose to scan an image from your device or save a generated QR code.</li>
            <li><strong>Local Notifications:</strong> We use local notifications to provide friendly reminders. These are triggered on-device based on local app activity. No usage data is transmitted to our servers to facilitate this feature.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Data Usage</h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            The information processed by the app (like scanned URLs or contact info) stays on your device unless you explicitly choose to share it using the sharing features of your operating system.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Third-Party Services</h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Crystal Scan does not sell or share your data with third parties. We do not use third-party analytics or advertising SDKs that track your behavior across other apps.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Changes to This Policy</h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us.
          </p>
        </section>
        
        <footer className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-zinc-500 dark:text-zinc-400">
          © 2026 Crystal Scan. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
