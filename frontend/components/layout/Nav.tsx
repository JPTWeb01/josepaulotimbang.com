"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/experience", label: "Experience" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Nav({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
        {links.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onLinkClick}
                className={cn(
                  "block px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150",
                  active
                    ? "text-foreground bg-card"
                    : "text-muted hover:text-foreground hover:bg-card/60"
                )}
              >
                {label}
              </Link>
            </li>
          );
        })}
        <li className="md:ml-4">
          <Link
            href="/resume"
            onClick={onLinkClick}
            className="block px-4 py-2 text-sm font-medium rounded-lg border border-primary/40 text-primary hover:bg-primary hover:text-white transition-colors duration-150"
          >
            Resume
          </Link>
        </li>
      </ul>
    </nav>
  );
}
