import MemoryGame from "@/components/memory-game/memory-game";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function MemoryGamePage() {
  return (
    <div className="overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="fixed top-12 left-10 w-full z-40 py-4 px-4">
          <div className="container mx-auto">
            <Link href="/">
              <Button
                variant="ghost"
                className="mt-5 font-bold text-blue-300 hover:text-blue-200 hover:bg-blue-900/20 hover:scale-110 transition-all duration-300 "
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                BACK TO GAMES
              </Button>
            </Link>
          </div>
        </div>
        <div className="pt-24">
          <MemoryGame />
        </div>
      </div>
    </div>
  );
}
