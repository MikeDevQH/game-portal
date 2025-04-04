import type React from "react";
import "@/app/globals.css";
import { Orbitron } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import Header from "@/components/header";

const orbitron = Orbitron({ subsets: ["latin"] });

export const metadata = {
  title: "Game Portal",
  description: "Play classic games reimagined with modern design",
  icons: "/favicon.png",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
      className={cn(
          orbitron.className,
          "h-screen antialiased overflow-auto"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
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
          <main className="pt-12 relative z-10 h-[calc(100vh-48px)]">
            {children}
          </main>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
