import FlappyBird from "@/components/flappy-bird/flappy-bird";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function FlappyBirdPage() {
  return (
    <div className="overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="fixed top-12 left-10 w-full z-40 py-4 px-4">
          <div className="container mx-auto">
            <Link href="/">
              <Button
                variant="ghost"
                className="mt-5 font-bold text-sky-300 hover:text-sky-200 hover:bg-sky-900/20 hover:scale-110 transition-all duration-300 "
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                BACK TO GAMES
              </Button>
            </Link>
          </div>
        </div>
        <div className="pt-5">
          <FlappyBird />
        </div>
      </div>
    </div>
  );
}