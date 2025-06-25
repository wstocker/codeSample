"use client"

import { useState } from "react"
import { ArticleSlideImproved } from "./ArticleSlideImproved"
import { DrupalArticle } from "@/types"

interface ArticleSliderClientImprovedProps {
  articles: DrupalArticle[]
  title: string
}

const BACKGROUND_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#8B5CF6", // Purple
]

export function ArticleSliderClientImproved({
  articles,
  title,
}: ArticleSliderClientImprovedProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null)
  const [hoveredArticleId, setHoveredArticleId] = useState<string | null>(null)

  // Handle different types of interactions
  const handleSlideFocus = (index: number) => {
    setFocusedIndex(index)
  }

  const handleSlideBlur = () => {
    setFocusedIndex(null)
  }

  const handleSlideSelect = (articleId: string) => {
    setSelectedArticleId(articleId)
    console.log(`Article selected: ${articleId}`)
    // You could do more here: navigate to article, show details, etc.
  }

  const handleSlideHover = (articleId: string) => {
    setHoveredArticleId(articleId)
    console.log(`Article hovered: ${articleId}`)
  }

  const handleSlideLeave = () => {
    setHoveredArticleId(null)
  }

  const getTitleColor = () => {
    if (focusedIndex !== null && focusedIndex < BACKGROUND_COLORS.length) {
      return BACKGROUND_COLORS[focusedIndex]
    }
    return "#374151"
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2
        className="text-3xl font-bold mb-8 transition-colors duration-300"
        style={{ color: getTitleColor() }}
      >
        {title}
      </h2>
      
      {/* Show current state */}
      <div className="mb-4 text-sm text-gray-600">
        {hoveredArticleId && <p>Hovering: {hoveredArticleId}</p>}
        {selectedArticleId && <p>Selected: {selectedArticleId}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <ArticleSlideImproved
            key={article.id}
            node={article}
            backgroundColor={BACKGROUND_COLORS[index % BACKGROUND_COLORS.length]}
            isFocused={focusedIndex === index}
            isSelected={selectedArticleId === article.id}
            onFocus={() => handleSlideFocus(index)}
            onBlur={handleSlideBlur}
            onSelect={handleSlideSelect}
            onHover={handleSlideHover}
            onLeave={handleSlideLeave}
          />
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center text-gray-500 py-12">No articles found</div>
      )}
    </div>
  )
} 