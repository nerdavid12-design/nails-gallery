import type { Metadata } from "next";
import { Space_Grotesk, Rubik } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin", "hebrew"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "NAILZ | מחקר תרבות הלק ג׳ל",
  description:
    "Share your photos from the NAILZ exhibit at Shaham Culture Lab, Jerusalem",
  openGraph: {
    title: "NAILZ | מחקר תרבות הלק ג׳ל",
    description: "Share your photos from the NAILZ exhibit",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={`${spaceGrotesk.variable} ${rubik.variable}`}>
      <body>
        <LanguageProvider>
          <Header />
          <main className="relative flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
