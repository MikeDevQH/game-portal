import OneLine from "@/components/one-line/one-line-game";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function OneLinePage() {
  return (
    <div className="overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="fixed top-12 left-10 w-full z-40 py-4 px-4">
          <div className="container mx-auto">
            <Link href="/">
              <Button
                variant="ghost"
                className="text-blue-200 hover:text-blue-100 hover:bg-blue-900/20"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                BACK TO GAMES
              </Button>
            </Link>
          </div>
        </div>
        <div className="pt-24">
          <OneLine />
        </div>
      </div>
    </div>
  );
}
