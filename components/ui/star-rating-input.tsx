// components/ui/star-rating-input.tsx
"use client"

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingInputProps {
  count?: number;
  value: number;
  onChange: (value: number) => void;
  size?: number;
  className?: string;
  disabled?: boolean;
}

export function StarRatingInput({
  count = 5,
  value,
  onChange,
  size = 24, // h-6 w-6
  className,
  disabled = false,
}: StarRatingInputProps) {
  const stars = Array.from({ length: count }, (_, i) => i + 1);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {stars.map((starValue) => (
        <Star
          key={starValue}
          className={cn(
            "cursor-pointer transition-colors",
            starValue <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-300 hover:text-yellow-300",
            disabled && "cursor-not-allowed opacity-50"
          )}
          style={{ width: size, height: size }}
          onClick={() => !disabled && onChange(starValue)}
          onMouseEnter={() => {
            if (!disabled) {
              // Poderia adicionar um efeito hover visual aqui se desejado
            }
          }}
          onMouseLeave={() => {
            if (!disabled) {
              // Limpar efeito hover visual
            }
          }}
        />
      ))}
    </div>
  );
}