import type { Metadata } from "next";
import { Inter, Crimson_Pro } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { MusicPlayerProvider } from "@/lib/music-context";
import { PlayerBar } from "@/components/music/PlayerBar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const crimsonPro = Crimson_Pro({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dancing Salamanders",
    template: "%s | Dancing Salamanders",
  },
  description:
    "Illuminating Hope Through Connection — Folk music, writing, and creative worlds from Dancing Salamanders.",
  openGraph: {
    siteName: "Dancing Salamanders",
    locale: "en_GB",
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dancingsalamanders.com",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${crimsonPro.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <MusicPlayerProvider>
          <Nav />
          <main className="flex-1">{children}</main>

          <PlayerBar />
        </MusicPlayerProvider>
      </body>
    </html>
  );
}
