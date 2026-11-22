import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { OG_IMAGE } from "@/lib/seo";

// Link-preview card (LinkedIn, Facebook, WhatsApp, Slack...), rendered once at
// build time to out/og.png. A route handler (not opengraph-image.tsx) so the
// file keeps its .png extension on Hostinger; pages reference it through
// pageMetadata() in lib/seo.ts.
export const dynamic = "force-static";
const size = { width: OG_IMAGE.width, height: OG_IMAGE.height };

const BG = "#080810";
const CARD = "#13131f";
const BORDER = "#1e1e2e";
const FG = "#f1f5f9";
const MUTED = "#94a3b8";
const PRIMARY = "#4f6ef7";

const TECH = ["React", "Next.js", "TypeScript", "Python", "Flask", "PHP", "LLM APIs"];

export async function GET() {
  const logo = await readFile(join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: BG,
          backgroundImage: `radial-gradient(circle at 85% 15%, rgba(79,110,247,0.22), transparent 45%)`,
          color: FG,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={72} height={72} alt="" style={{ borderRadius: 36 }} />
          <div style={{ display: "flex", fontSize: 28, color: MUTED }}>josepaulotimbang.com</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 88, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>
            Jose Paulo Timbang
          </div>
          <div style={{ display: "flex", fontSize: 44, color: PRIMARY, marginTop: 16 }}>
            Full-Stack &amp; AI Developer
          </div>
          <div style={{ display: "flex", fontSize: 28, color: MUTED, marginTop: 20 }}>
            8 years building web apps and AI-powered platforms · Ottawa, Canada
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {TECH.map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                padding: "10px 20px",
                fontSize: 24,
                color: FG,
                background: CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: 999,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
