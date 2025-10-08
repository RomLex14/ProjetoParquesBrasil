import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Review } from "@/lib/types"

interface ReviewCardProps {
  review: Review
  expanded?: boolean
}

export default function ReviewCard({ review, expanded = false }: ReviewCardProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarImage src={review.user.avatar} alt={review.user.name} />
          <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{review.user.name}</h4>
            <span className="text-xs text-muted-foreground">{review.date}</span>
          </div>
          <div className="flex items-center mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
              />
            ))}
          </div>
        </div>
      </div>
      <p className={expanded ? "" : "line-clamp-3"}>{review.content}</p>
      {review.photos && review.photos.length > 0 && expanded && (
        <div className="grid grid-cols-4 gap-2 mt-3">
          {review.photos.map((photo, i) => (
            <div key={i} className="aspect-square rounded-md overflow-hidden">
              <img
                src={photo || "/placeholder.svg"}
                alt={`Foto da avaliação ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
