import { DrupalArticle } from "@/types"

interface ArticleSlideProps {
  node: Partial<DrupalArticle>
  backgroundColor: string
  isFocused: boolean
  onFocus: () => void
  onBlur: () => void
}

export function ArticleSlide({ 
  node, 
  backgroundColor, 
  isFocused, 
  onFocus, 
  onBlur 
}: ArticleSlideProps) {
  return (
    <div 
      className={`p-6 rounded-lg transition-all duration-300 cursor-pointer ${
        isFocused ? 'shadow-lg transform scale-105' : 'shadow-md'
      }`}
      style={{ 
        backgroundColor: isFocused ? backgroundColor : '#f8f9fa',
        border: isFocused ? `2px solid ${backgroundColor}` : '2px solid transparent'
      }}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseEnter={onFocus}
      onMouseLeave={onBlur}
      tabIndex={0}
    >
      <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${
        isFocused ? 'text-white' : 'text-gray-800'
      }`}>
        {node.title}
      </h3>
      <p className={`text-sm transition-colors duration-300 ${
        isFocused ? 'text-white opacity-90' : 'text-gray-600'
      }`}>
        {node.body?.processed?.substring(0, 150)}...
      </p>
      {node.created && (
        <p className={`text-xs mt-3 transition-colors duration-300 ${
          isFocused ? 'text-white opacity-75' : 'text-gray-500'
        }`}>
          {new Date(node.created.time).toLocaleDateString()}
        </p>
      )}
    </div>
  )
} 