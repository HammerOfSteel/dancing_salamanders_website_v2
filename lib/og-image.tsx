import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// Approximate hex equivalents of the oklch brand colors in app/globals.css
// (satori, which ImageResponse uses to render, does not support oklch()).
const BG_COLOR = "#141b10"; // deep forest night
const TEXT_COLOR = "#f2ecdd"; // warm cream
const ACCENT_COLOR = "#c98a4b"; // amber ember

async function coverArtDataUri(coverPath: string): Promise<string | null> {
  try {
    // coverPath is a public/-relative URL like "/music/01_ordain/cover.jpg" —
    // strip the leading slash before joining, or path.join would discard
    // the preceding segments and return coverPath unchanged.
    const relativePath = coverPath.replace(/^\//, "");
    const absolutePath = path.join(process.cwd(), "public", relativePath);
    if (!fs.existsSync(absolutePath)) return null;
    const ext = path.extname(absolutePath).slice(1).toLowerCase() || "jpeg";
    const bytes = fs.readFileSync(absolutePath);
    // satori (used by next/og's ImageResponse) only understands png/jpeg/gif
    // raster images, so formats like webp must be converted first.
    if (ext === "png" || ext === "jpg" || ext === "jpeg" || ext === "gif") {
      const mime = ext === "jpg" ? "jpeg" : ext;
      return `data:image/${mime};base64,${bytes.toString("base64")}`;
    }
    const pngBuffer = await sharp(bytes).png().toBuffer();
    return `data:image/png;base64,${pngBuffer.toString("base64")}`;
  } catch {
    return null;
  }
}

interface PreviewCardOptions {
  topText: string;
  subText?: string;
  coverPath?: string;
}

export async function renderPreviewCard({ topText, subText, coverPath }: PreviewCardOptions): Promise<ImageResponse> {
  const coverDataUri = coverPath ? await coverArtDataUri(coverPath) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
          backgroundColor: BG_COLOR,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <div style={{ display: "flex", fontSize: 56, fontWeight: 600, color: TEXT_COLOR }}>
            {topText}
          </div>
          {subText && (
            <div style={{ display: "flex", fontSize: 32, color: ACCENT_COLOR }}>{subText}</div>
          )}
        </div>

        {coverDataUri && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverDataUri}
            width={280}
            height={280}
            style={{ borderRadius: 12, objectFit: "cover" }}
          />
        )}

        <div style={{ display: "flex", fontSize: 28, color: ACCENT_COLOR }}>Dancing Salamanders</div>
      </div>
    ),
    { width: OG_WIDTH, height: OG_HEIGHT }
  );
}
