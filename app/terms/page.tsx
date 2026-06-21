import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-4xl mx-auto py-12 px-6">
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline mb-8 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-4">Last Updated: June 21, 2026</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            By downloading or using the Crystal Scan mobile application, you agree to be bound by these Terms of Service. If you do not agree, do not use the application.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Crystal Scan grants you a personal, non-exclusive, non-transferable, limited license to use the app for personal, non-commercial purposes on your mobile device.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Subscriptions and Payments</h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
            Crystal Scan offers a premium version called "Crystal Pro" which provides additional features such as unlimited scans, custom logos, batch scanning, and an ad-free experience.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li><strong>Plans:</strong> Crystal Pro is available through monthly, yearly, and lifetime (one-time purchase) plans.</li>
            <li><strong>Billing:</strong> Payments are processed through the Google Play Store. You agree to comply with their terms and conditions regarding payments and refunds.</li>
            <li><strong>Renewals:</strong> Monthly and yearly subscriptions will automatically renew unless canceled at least 24 hours before the end of the current period.</li>
            <li><strong>Cancellation:</strong> You can manage and cancel your subscriptions through your Google Play Store account settings at any time.</li>
            <li><strong>Refunds:</strong> All purchases are final and non-refundable, except as required by law or the policies of the Google Play Store.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Prohibited Conduct</h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            You agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400 mt-2">
            <li>Modify, reverse engineer, or decompile the application.</li>
            <li>Use the application for any illegal purpose.</li>
            <li>Attempt to gain unauthorized access to any part of the application.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. App Communications</h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Crystal Scan may send you local notifications or reminders. You can opt-out of these communications at any time through the application settings or your device's system settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            All rights, title, and interest in and to the application (including logos, UI design, and code) are and will remain the exclusive property of Crystal Scan.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Disclaimer of Warranty</h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
            THE APPLICATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. WE DO NOT WARRANT THAT THE APP WILL BE ERROR-FREE OR UNINTERRUPTED.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            In no event shall Crystal Scan be liable for any damages arising out of the use or inability to use the application.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            These terms are governed by the laws of your jurisdiction, without regard to its conflict of law principles.
          </p>
        </section>

        <footer className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-zinc-500 dark:text-zinc-400">
          © 2026 Crystal Scan. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
