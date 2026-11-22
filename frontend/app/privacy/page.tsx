import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What data josepaulotimbang.com collects, why, and how long it is kept.",
  alternates: { canonical: "/privacy" },
};

const sections: { title: string; body: string[] }[] = [
  {
    title: "Analytics cookies",
    body: [
      "If you click Accept on the cookie notice, this site loads Google Analytics 4 to count page views and a few actions (opening the chat, downloading the resume, sending the contact form). It helps me see which pages and projects are useful.",
      "If you click No thanks, Google Analytics is never loaded. You can change your choice any time with the Cookie settings link in the footer.",
      "Google Analytics data is kept for 14 months. Advertising features are turned off and the data is never sold.",
    ],
  },
  {
    title: "Contact form",
    body: [
      "Messages sent through the contact form are delivered to my email by Web3Forms. Your name, email and message are used only to reply to you.",
    ],
  },
  {
    title: "AI chatbot",
    body: [
      "Messages you type into the chat are sent to my chatbot service, which uses Google Gemini to write a reply. Don't share sensitive personal information in the chat.",
      "Each chat message is saved with the bot's reply, the date and time, your IP address, the country it maps to, the page you were on and your browser type. I read these logs to see what visitors ask and to improve the answers. Only I can see them.",
      "Chat logs are deleted automatically after 90 days. Country lookup uses the free IP to Country Lite database by DB-IP (db-ip.com), which runs on my own server, so your IP address isn't sent to another service for it.",
    ],
  },
  {
    title: "Your choices",
    body: [
      "To ask what data I have about you, or to have it deleted, email contactme@josepaulotimbang.com.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <p className="text-primary text-xs font-mono uppercase tracking-widest mb-2">Privacy</p>
      <h1 className="text-4xl font-bold text-foreground mb-4">Privacy policy</h1>
      <p className="text-muted mb-12">Last updated November 21, 2026.</p>
      <div className="space-y-10">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-xl font-semibold text-foreground mb-3">{s.title}</h2>
            <div className="space-y-3 text-muted leading-relaxed">
              {s.body.map((p) => <p key={p}>{p}</p>)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
