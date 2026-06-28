import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/JPTWeb01",
    icon: GitHubIcon,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/josepaulotimbang",
    icon: LinkedInIcon,
  },
  {
    label: "Email",
    href: "mailto:contactme@josepaulotimbang.com",
    icon: Mail,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/logo.png"
            alt="JPT Logo"
            width={28}
            height={28}
            className="rounded-full opacity-70 group-hover:opacity-100 transition-opacity"
          />
          <p className="text-sm text-subtle">
            &copy; {new Date().getFullYear()} Jose Paulo Timbang. All rights reserved.
          </p>
        </Link>

        <div className="flex items-center gap-2">
          {socials.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={label}
              className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-card transition-colors"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
