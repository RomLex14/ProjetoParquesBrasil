import Link from "next/link"
import { MapPin, Star, Clock, ArrowRight } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Trilhas } from "@/lib/types" 

interface TrailCardProps {
  trail: Trilhas 
}

export default function TrailCard({ trail }: TrailCardProps) {
  const difficultyMap: Record<string, string> = {
    Easy: "Fácil",
    Moderate: "Moderada",
    Hard: "Difícil",
  }

  // Assegura que trail.difficulty é um dos valores esperados ou usa o valor original
  const displayDifficulty = difficultyMap[trail.difficulty as keyof typeof difficultyMap] || trail.difficulty;

  return (
    <Card className="bg-card text-card-foreground rounded-xl shadow-md border border-border transition hover:shadow-lg hover:border-primary overflow-hidden flex flex-col h-full">
      <Link href={`/trilhas/${trail.id}`} className="block">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={trail.imageUrl || "/placeholder.svg"} // Usar um placeholder mais informativo talvez
            alt={trail.name}
            className="object-cover w-full h-full transition-transform hover:scale-105 duration-300" />
          <div className="absolute top-2 right-2">
            {/* A cor do badge pode ser dinâmica baseada na dificuldade também */}
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              {displayDifficulty}
            </Badge>
          </div>
        </div>
      </Link>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <Link href={`/trilhas/${trail.id}`} className="block">
              <h3 className="font-bold text-lg line-clamp-1 hover:text-primary transition-colors">{trail.name}</h3>
            </Link>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{trail.location}</span>
            </div>
          </div>
          {typeof trail.rating === 'number' && ( // Adicionada verificação para rating
            <div className="flex items-center flex-shrink-0 ml-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-medium">{trail.rating.toFixed(1).replace(".", ",")}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mb-2">
          {trail.duration && ( // Adicionada verificação
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{trail.duration}</span>
            </div>
          )}
          {typeof trail.distance === 'number' && ( // Adicionada verificação
            <div>
              <span>{trail.distance.toString().replace(".", ",")} km</span>
            </div>
          )}
          {typeof trail.elevation === 'number' && ( // Adicionada verificação
            <div>
              <span>{trail.elevation}m ganho</span>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">{trail.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/trilhas/${trail.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            Ver Trilha
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}