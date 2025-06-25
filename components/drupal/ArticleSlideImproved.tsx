import { DrupalArticle } from "@/types"

interface ArticleSlideImprovedProps {
  node: Partial<DrupalArticle>
  backgroundColor: string
  isFocused: boolean
  isSelected?: boolean
  
  // Different callbacks for different actions
  onFocus?: () => void
  onBlur?: () => void
  onSelect?: (articleId: string) => void
  onHover?: (articleId: string) => void
  onLeave?: () => void
}

export function ArticleSlideImproved({
  node,
  backgroundColor,
  isFocused,
  isSelected = false,
  onFocus,
  onBlur,
  onSelect,
  onHover,
  onLeave,
}: ArticleSlideImprovedProps) {
  
  const handleMouseEnter = () => {
    // Notify parent about hover
    if (onHover && node.id) {
      onHover(node.id)
    }
    // Also call the old focus callback for backward compatibility
    if (onFocus) {
      onFocus()
    }
  }

  const handleMouseLeave = () => {
    // Notify parent about leaving
    if (onLeave) {
      onLeave()
    }
    // Also call the old blur callback for backward compatibility
    if (onBlur) {
      onBlur()
    }
  }

  const handleClick = () => {
    // Notify parent about selection
    if (onSelect && node.id) {
      onSelect(node.id)
    }
  }

  return (
    <div
      className={`p-6 rounded-lg transition-all duration-300 cursor-pointer ${
        isFocused ? "shadow-lg transform scale-105" : "shadow-md"
      } ${isSelected ? "ring-4 ring-blue-500" : ""}`}
      style={{
        backgroundColor: isFocused ? backgroundColor : "#f8f9fa",
        border: isFocused
          ? `2px solid ${backgroundColor}`
          : "2px solid transparent",
      }}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      tabIndex={0}
    >
      <h3
        className={`text-xl font-bold mb-3 transition-colors duration-300 ${
          isFocused ? "text-white" : "text-gray-800"
        }`}
      >
        {node.title}
      </h3>
      <p
        className={`text-sm transition-colors duration-300 ${
          isFocused ? "text-white opacity-90" : "text-gray-600"
        }`}
      >
        {node.body?.processed?.substring(0, 150)}...
      </p>
      {node.created && (
        <p
          className={`text-xs mt-3 transition-colors duration-300 ${
            isFocused ? "text-white opacity-75" : "text-gray-500"
          }`}
        >
          {new Date(node.created.time).toLocaleDateString()}
        </p>
      )}
      
      {/* Show selection state */}
      {isSelected && (
        <div className="mt-2 text-xs text-blue-600 font-semibold">
          ✓ Selected
        </div>
      )}
    </div>
  )
} 