"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface HelpDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function HelpDialog({ isOpen, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-indigo-950 border-indigo-500/30 text-indigo-200">
        <DialogHeader>
          <DialogTitle className="text-indigo-100 text-xl">How to Play One Line</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-indigo-300">
          <div className="space-y-4 py-2">
            <p>
              One Line is a puzzle game where you need to draw a single continuous line that passes through all the
              edges exactly once.
            </p>

            <div className="space-y-2">
              <h4 className="font-semibold text-indigo-200">Rules:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Start by clicking on any point</li>
                <li>Draw a line by connecting to adjacent points</li>
                <li>You must use each available path exactly once</li>
                <li>You cannot cross or reuse paths</li>
                <li>The puzzle is solved when all paths are used exactly once</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-indigo-200">Tips:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Plan your route before starting</li>
                <li>Consider which points have an odd number of connections</li>
                <li>You can only start and end at points with an odd number of connections</li>
                <li>
                  If all points have an even number of connections, you can start anywhere and must end where you
                  started
                </li>
                <li>Use the hint button if you get stuck</li>
              </ul>
            </div>
          </div>
        </DialogDescription>
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button className="bg-indigo-700 hover:bg-indigo-600 text-white">Got it</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
