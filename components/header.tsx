import Link from "next/link";
import { Github, Home } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-blue-500/20 py-2">
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
  );
}
