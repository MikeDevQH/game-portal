import SnakeGame from "@/components/snake-game/game";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function SnakePage() {
  return (
    <div className="overflow-hidden">
      <div className="container mx-auto px-4 py-8">
        <div className="container mx-auto">
          <Link href="/">
            <Button
              variant="ghost"
              className="mt-5 font-bold text-emerald-300 hover:text-emerald-200 hover:bg-emerald-900/20 hover:scale-110 transition-all duration-300 "
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              BACK TO GAMES
            </Button>
          </Link>
        </div>
        <SnakeGame />
      </div>
    </div>
  );
}
