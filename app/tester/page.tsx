import Image from "next/image";
import Link from "next/link";
import { Users, FlaskConical, Download, ArrowRight } from "lucide-react";

export default function TesterGuide() {
  const steps = [
    {
      title: "Step 1: Join the Tester Group",
      description: "Google Play requires testers to be part of a group before they can access the app. Join our official testing community to get access.",
      link: "https://groups.google.com/g/nqm-inovation-tester",
      linkText: "Join Google Group",
      icon: <Users className="w-8 h-8 text-blue-600" />
    },
    {
      title: "Step 2: Opt-in for Testing",
      description: "After joining the group, you need to officially opt-in to the Crystal Scan testing program on Google Play.",
      link: "https://play.google.com/apps/testing/app.pwhs.crystalscan",
      linkText: "Become a Tester",
      icon: <FlaskConical className="w-8 h-8 text-blue-600" />
    },
    {
      title: "Step 3: Download the App",
      description: "Once you've opted in, you can download the app directly from the Google Play Store.",
      link: "https://play.google.com/store/apps/details?id=app.pwhs.crystalscan",
      linkText: "Download on Google Play",
      icon: <Download className="w-8 h-8 text-blue-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Simple Header */}
      <header className="bg-background border-b border-zinc-200 dark:border-zinc-800 py-6">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/icon.png" alt="Crystal Scan Icon" width={32} height={32} className="rounded-lg" />
            <span className="font-bold text-xl tracking-tight">Crystal Scan</span>
          </Link>
          <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase rounded-full">Closed Testing</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-16 px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Help Us Build the Future of <span className="text-blue-600">Crystal Scan</span></h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Thank you for your interest! We are currently in closed testing. Follow these three simple steps to get started.
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-background p-8 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row gap-8 items-start md:items-center transition-all hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center shrink-0">
                {step.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                  {step.description}
                </p>
                <a 
                  href={step.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-foreground text-background rounded-xl font-semibold hover:opacity-90 transition-all hover:scale-[1.02]"
                >
                  {step.linkText}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-blue-600 rounded-[2rem] p-10 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Found a bug?</h3>
          <p className="text-blue-100 mb-0">
            As a tester, your feedback is invaluable. Please report any issues or suggestions directly through the Google Play Store feedback section or our Google Group.
          </p>
        </div>
      </main>

      <footer className="py-12 text-center text-zinc-400 text-sm">
        © 2026 Crystal Scan. Built with precision for testers.
      </footer>
    </div>
  );
}
