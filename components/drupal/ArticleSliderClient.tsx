"use client"

import { useState } from "react"
import { ArticleSlide } from "./ArticleSlider"
import { DrupalArticle } from "@/types"

interface ArticleSliderClientProps {
  articles: DrupalArticle[]
  title: string
  usingMockData: boolean
}

const BACKGROUND_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#8B5CF6", // Purple
]

export function ArticleSliderClient({
  articles,
  title,
  usingMockData,
}: ArticleSliderClientProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  const handleSlideFocus = (index: number) => {
    setFocusedIndex(index)
  }

  const handleSlideBlur = () => {
    setFocusedIndex(null)
  }

  const getTitleColor = () => {
    if (focusedIndex !== null && focusedIndex < BACKGROUND_COLORS.length) {
      return BACKGROUND_COLORS[focusedIndex]
    }
    return "#374151" // Default gray color
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2
        className="text-3xl font-bold mb-8 transition-colors duration-300"
        style={{ color: getTitleColor() }}
      >
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <ArticleSlide
            key={article.id}
            node={article}
            backgroundColor={
              BACKGROUND_COLORS[index % BACKGROUND_COLORS.length]
            }
            isFocused={focusedIndex === index}
            onFocus={() => handleSlideFocus(index)}
            onBlur={handleSlideBlur}
          />
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center text-gray-500 py-12">No articles found</div>
      )}
    </div>
  )
}
