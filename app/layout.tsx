import type React from "react"
import "@/app/globals.css"
import { Orbitron } from "next/font/google"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import Header from "@/components/header"
import { Analytics } from "@vercel/analytics/react"

const orbitron = Orbitron({ subsets: ["latin"] })

export const metadata = {
  title: "Game Portal",
  description: "Explore a collection of classic browser games reimagined with a modern design. Play memory match, Tetris, Tic-Tac-Toe and more!",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Game Portal",
    description: "Classic browser games reimagined with a modern design.",
    url: "https://gameportalweb.vercel.app/", 
    siteName: "Game Portal",
    images: [
      {
        url: "/GamePortal-Banner.png",
        secureUrl: "https://gameportalweb.vercel.app/GamePortal-Banner.png",
        width: 1200,
        height: 630,
        alt: "Game Portal Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Game Portal",
    description: "Play classic games like Tetris, Memory Match, and Tic-Tac-Toe reimagined in a sleek new design.",
    images: ["/GamePortal-Banner.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(orbitron.className, "h-screen antialiased overflow-auto dark")}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="animated-background">
            <div className="stars"></div>
            <div className="twinkling"></div>
            <div className="game-grid"></div>
            <div className="floating-shapes">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className={`shape shape-${i % 5}`}></div>
              ))}
            </div>
          </div>
          <Header />
          <main className="pt-12 relative z-10 h-[calc(100vh-48px)]">{children}</main>
          <Toaster position="top-center" />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

