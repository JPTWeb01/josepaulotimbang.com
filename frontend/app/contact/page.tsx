import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Jose Paulo Timbang — available for freelance work, full-time roles, and collaboration.",
};

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="mb-16">
        <p className="text-primary text-xs font-mono uppercase tracking-widest mb-2">
          Contact
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
          Let&apos;s work together
        </h1>
        <p className="text-muted max-w-xl leading-relaxed">
          I&apos;m open to full-time positions, freelance projects, and
          interesting collaborations. Drop me a message and I&apos;ll reply
          within 24 hours.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-12">
        {/* Left column — contact info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-card border border-border rounded-lg shrink-0">
                <Mail size={16} className="text-muted" />
              </div>
              <div>
                <p className="text-xs text-subtle mb-0.5">Email</p>
                <a
                  href="mailto:contactme@josepaulotimbang.com"
                  className="text-sm text-foreground hover:text-primary transition-colors"
                >
                  contactme@josepaulotimbang.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-card border border-border rounded-lg shrink-0">
                <MapPin size={16} className="text-muted" />
              </div>
              <div>
                <p className="text-xs text-subtle mb-0.5">Location</p>
                <p className="text-sm text-foreground">Stittsville, ON, Canada</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-card border border-border rounded-lg shrink-0">
                <GitHubIcon size={16} className="text-muted" />
              </div>
              <div>
                <p className="text-xs text-subtle mb-0.5">GitHub</p>
                <a
                  href="https://github.com/JPTWeb01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground hover:text-primary transition-colors"
                >
                  github.com/JPTWeb01
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-card border border-border rounded-lg shrink-0">
                <LinkedInIcon size={16} className="text-muted" />
              </div>
              <div>
                <p className="text-xs text-subtle mb-0.5">LinkedIn</p>
                <a
                  href="https://linkedin.com/in/josepaulotimbang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground hover:text-primary transition-colors"
                >
                  linkedin.com/in/josepaulotimbang
                </a>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-xs text-subtle uppercase tracking-widest font-mono mb-2">
              Availability
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm text-primary font-medium">
                Available for work
              </span>
            </div>
            <p className="text-xs text-muted mt-2 leading-relaxed">
              Open to full-time roles, freelance contracts, and remote
              opportunities.
            </p>
          </div>
        </div>

        {/* Right column — form */}
        <div className="lg:col-span-3">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
