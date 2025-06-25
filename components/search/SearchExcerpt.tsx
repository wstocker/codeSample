import React from 'react'
import { withTextTrimming } from '../utils/withTextTrimming'

interface SearchExcerptProps {
  text: string
  query?: string
  maxLength?: number
  className?: string
}

function SearchExcerptComponent({ text, query, className = '' }: SearchExcerptProps) {
  // Highlight the search query in the text
  const highlightText = (text: string, query?: string) => {
    if (!query) return text

    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)

    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span className="font-bold bg-yellow-200" key={i}>
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    )
  }

  return (
    <p className={`text-gray-600 mb-2 ${className}`}>
      {highlightText(text, query)}
    </p>
  )
}

// Apply the HOC to create the trimmed version
export const SearchExcerpt = withTextTrimming(SearchExcerptComponent)

// Export the base component for cases where trimming isn't needed
export { SearchExcerptComponent } 