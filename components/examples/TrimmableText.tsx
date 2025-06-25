import React from 'react'
import { withTextTrimming } from '../utils/withTextTrimming'

interface TrimmableTextProps {
  text: string
  maxLength?: number
  variant?: 'default' | 'title' | 'description'
  className?: string
}

function TrimmableTextComponent({ 
  text, 
  variant = 'default', 
  className = '' 
}: TrimmableTextProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'title':
        return 'text-lg font-semibold text-gray-900'
      case 'description':
        return 'text-sm text-gray-600 italic'
      default:
        return 'text-base text-gray-700'
    }
  }

  return (
    <div className={`${getVariantStyles()} ${className}`}>
      {text}
    </div>
  )
}

// Create different versions of the component with different default lengths
export const TrimmableText = withTextTrimming(TrimmableTextComponent)

// Short version for titles
export const TrimmableTitle = withTextTrimming(
  (props: TrimmableTextProps) => <TrimmableTextComponent {...props} variant="title" />
)

// Medium version for descriptions
export const TrimmableDescription = withTextTrimming(
  (props: TrimmableTextProps) => <TrimmableTextComponent {...props} variant="description" />
)

// Example usage component
export function TextTrimmingExample() {
  const longText = "This is a very long text that demonstrates how the text trimming HOC works. It will automatically trim the text to the specified length and add ellipsis if needed. This is useful for displaying excerpts, titles, or descriptions in a consistent way across your application."

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-bold">Text Trimming Examples</h3>
      
      <div>
        <h4 className="font-semibold mb-2">Default (350 chars):</h4>
        <TrimmableText text={longText} />
      </div>
      
      <div>
        <h4 className="font-semibold mb-2">Title (100 chars):</h4>
        <TrimmableTitle text={longText} maxLength={100} />
      </div>
      
      <div>
        <h4 className="font-semibold mb-2">Description (200 chars):</h4>
        <TrimmableDescription text={longText} maxLength={200} />
      </div>
    </div>
  )
} 