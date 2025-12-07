// import UmamiAnalytics from '@/components/analytics/UmamiAnalytics';
import ChatBubble from "@/components/common/ChatBubble";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
// import OnekoCat from '@/components/common/OnekoCat';
import { Quote } from "@/components/common/Quote";
import { ThemeProvider } from "@/components/common/ThemeProviders";
import { generateMetadata as getMetadata } from "@/config/Meta";
import ReactLenis from "lenis/react";
import { Outfit } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";

import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
});

export const metadata = getMetadata("/");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script src="https://sdk.scdn.co/spotify-player.js" async></script>
        </head>
        <body
          className={`${outfit.variable} font-sans antialiased`}
          suppressHydrationWarning
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ReactLenis root>
              <Navbar />
              {children}
              {/* <OnekoCat /> */}
              <Quote />
              <Footer />
              <ChatBubble />
              {/* <UmamiAnalytics /> */}
            </ReactLenis>
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
