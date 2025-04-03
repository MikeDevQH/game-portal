import type React from "react"
import "@/app/globals.css"
import { Orbitron } from "next/font/google"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Home, Github } from "lucide-react"

const orbitron = Orbitron({ subsets: ["latin"] })

export const metadata = {
  title: "Game Portal",
  description: "Play classic games reimagined with modern design",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(orbitron.className, "min-h-screen antialiased")}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="game-background">
            <div className="game-grid"></div>
          </div>
          <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-blue-500/20">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <Link
                href="/"
                className="flex items-center gap-2 text-blue-300 hover:text-blue-100 transition-all duration-300"
              >
                <Home className="h-5 w-5" />
                <span className="font-medium tracking-wider">GAME PORTAL</span>
              </Link>
              <a
                href="https://github.com/MikeDevQH"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-100 transition-colors flex items-center gap-1"
              >
                <Github className="h-5 w-5" />
                <span className="hidden sm:inline text-sm">MikeDevQH</span>
              </a>
            </div>
          </header>
          <main className="pt-12 relative z-10">{children}</main>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'