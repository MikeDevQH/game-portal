import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface GameCardProps {
  title: string;
  titleColor: string;
  hoverTitle: string;
  description: string;
  descriptionColor: string;
  icon: LucideIcon;
  iconColor: string;
  link: string;
  borderColor: string;
  hoverBorderColor: string;
  textColor: string;
  bgGradient: string;
  hoverShadow: string;
  hoverBgGradient: string;
  bgButton: string;
  hoverBgButton: string;
  textButton: string;
  borderButton: string;
  
}

export default function GameCard({
  title,
  titleColor,
  hoverTitle,
  description,
  descriptionColor,
  icon: Icon,
  iconColor,
  link,
  borderColor,
  hoverBorderColor,
  textColor,
  bgGradient,
  hoverShadow,
  hoverBgGradient,
  bgButton,
  hoverBgButton,
  textButton,
  borderButton,
}: GameCardProps) {
  return (
    <Card className={`bg-slate-900/40 ${borderColor} ${hoverBorderColor} transition-all duration-300 hover:shadow-lg ${hoverShadow} group overflow-hidden backdrop-blur-sm`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-2xl ${titleColor} ${hoverTitle}`}>{title}</CardTitle>
        <CardDescription className={`${descriptionColor}`}>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4 pb-6">
        <div className={`h-48 bg-gradient-to-br ${bgGradient} rounded-md flex items-center justify-center overflow-hidden relative ${hoverBgGradient} transition-all duration-500`}>
          <div className="absolute inset-0 opacity-20 bg-grid-pattern"></div>
          <Icon className={`h-20 w-20 ${iconColor} group-hover:scale-110 transition-transform duration-300 relative z-10`} />
        </div>
      </CardContent>
      <CardFooter>
        <Link href={link} className="w-full">
          <Button className={`w-full ${bgButton} ${textButton} ${borderButton} ${hoverBgButton}`}>
            PLAY NOW
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
