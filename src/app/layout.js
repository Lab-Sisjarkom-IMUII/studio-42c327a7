import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "studio.imuii.id - Upload & Share Templates",
  description: "Platform untuk berbagi dan menemukan template portfolio dan CV terbaik untuk imuii.id. Buat, upload, dan gunakan template berkualitas tinggi.",
  icons: {
    icon: [
      { url: "/MainLogo.png", sizes: "32x32", type: "image/png" },
      { url: "/MainLogo.png", sizes: "16x16", type: "image/png" },
      { url: "/MainLogo.png", sizes: "any", type: "image/png" },
    ],
    shortcut: "/MainLogo.png",
    apple: [
      { url: "/MainLogo.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        type: "image/png",
        url: "/MainLogo.png",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://studio.imuii.id",
    siteName: "studio.imuii.id",
    title: "studio.imuii.id - Upload & Share Templates",
    description: "Platform untuk berbagi dan menemukan template portfolio dan CV terbaik untuk imuii.id",
    images: [
      {
        url: "/MainLogo.png",
        width: 1200,
        height: 630,
        alt: "studio.imuii.id Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "studio.imuii.id - Upload & Share Templates",
    description: "Platform untuk berbagi dan menemukan template portfolio dan CV terbaik untuk imuii.id",
    images: ["/MainLogo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
