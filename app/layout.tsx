import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import { PageTransition } from "@/components/page-transition";
import { HomeSocialDock } from "@/components/home-social-dock";
import { SiteChromeVisibility } from "@/components/site-chrome-visibility";
import { getLiveContent } from "@/lib/live-content";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getLiveContent();
  const companyName = content.settings.companyName || "Modern Age Studio";
  const tagline = content.settings.tagline || "Architecture Studio";
  const logoUrl = content.settings.logoUrl;

  return {
    title: `${companyName} | ${tagline}`,
    description: content.settings.homeTagline || "A polished architecture firm portfolio.",
    icons: logoUrl
      ? {
          icon: logoUrl,
          shortcut: logoUrl,
          apple: logoUrl
        }
      : undefined,
    openGraph: {
      title: `${companyName} | ${tagline}`,
      description: content.settings.homeTagline || tagline,
      siteName: companyName,
      images: logoUrl ? [{ url: logoUrl, alt: companyName }] : undefined
    }
  };
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getLiveContent();
  const socialLinks = [
    { label: "WhatsApp", href: content.settings.whatsapp },
    { label: "Call", href: `tel:${content.settings.phone.replace(/\s+/g, "")}` },
    { label: "Facebook", href: content.settings.facebook }
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased transition-colors duration-500`}>
        <Providers>
          <SiteChromeVisibility />
          <Navbar
            companyName={content.settings.companyName}
            tagline={content.settings.tagline}
            logoUrl={content.settings.logoUrl}
          />
          <PageTransition>{children}</PageTransition>
          <HomeSocialDock links={socialLinks} />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
