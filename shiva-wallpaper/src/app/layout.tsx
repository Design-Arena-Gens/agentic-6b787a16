import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shiva Tandav 8K Wallpaper",
  description:
    "HDR अल्ट्रा सिनेमैटिक भगवान शिव तांडव वॉलपेपर — बिजली, बवंडर और दिव्य ऊर्जा से भरपूर 8K कलाकृति।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#02040b] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
