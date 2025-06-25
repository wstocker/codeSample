import React from 'react'

interface WithTextTrimmingProps {
  text: string
  maxLength?: number
}

export function withTextTrimming<P extends object>(
  WrappedComponent: React.ComponentType<P & WithTextTrimmingProps>
) {
  return function WithTextTrimmingComponent(props: P & WithTextTrimmingProps) {
    const { text, maxLength = 350, ...restProps } = props
    
    const trimmedText = text && text.length > maxLength 
      ? text.substring(0, maxLength).trim() + '...'
      : text

    return (
      <WrappedComponent
        {...(restProps as P)}
        text={trimmedText}
        maxLength={maxLength}
      />
    )
  }
}

// Utility function for standalone use
export function trimText(text: string, maxLength: number = 350): string {
  if (!text) return ''
  return text.length > maxLength 
    ? text.substring(0, maxLength).trim() + '...'
    : text
} 