# withTextTrimming Higher-Order Component

A reusable higher-order component (HOC) that automatically trims text to a specified length and adds ellipsis if needed.

## Features

- Automatically trims text to specified length (default: 350 characters)
- Adds ellipsis (...) when text is trimmed
- Preserves word boundaries by trimming at the last complete word
- TypeScript support with proper type inference
- Can be used with any component that accepts a `text` prop

## Usage

### Basic Usage

```tsx
import { withTextTrimming } from './components/utils/withTextTrimming'

interface MyComponentProps {
  text: string
  maxLength?: number
  // ... other props
}

function MyComponent({ text, ...props }: MyComponentProps) {
  return <p>{text}</p>
}

// Apply the HOC
const TrimmableMyComponent = withTextTrimming(MyComponent)

// Use the component
<TrimmableMyComponent text="Very long text..." maxLength={200} />
```

### With SearchExcerpt Component

```tsx
import { SearchExcerpt } from './components/search/SearchExcerpt'

// The SearchExcerpt component already uses the HOC
<SearchExcerpt 
  text={result.excerpt} 
  query={searchQuery}
  maxLength={350}
/>
```

### Standalone Utility Function

```tsx
import { trimText } from './components/utils/withTextTrimming'

const trimmedText = trimText("Very long text...", 200)
// Returns: "Very long text..." (trimmed to 200 chars + ellipsis)
```

## API

### withTextTrimming HOC

**Parameters:**
- `WrappedComponent`: React component that accepts `text` and `maxLength` props

**Returns:**
- A new component with the same props as the original, plus automatic text trimming

**Props:**
- `text: string` - The text to be trimmed
- `maxLength?: number` - Maximum length (default: 350)

### trimText Utility Function

**Parameters:**
- `text: string` - The text to trim
- `maxLength: number` - Maximum length (default: 350)

**Returns:**
- `string` - The trimmed text with ellipsis if needed

## Examples

### Creating Different Text Components

```tsx
// Short titles
const TrimmableTitle = withTextTrimming(
  (props) => <h2 className="text-xl font-bold">{props.text}</h2>
)

// Medium descriptions
const TrimmableDescription = withTextTrimming(
  (props) => <p className="text-gray-600">{props.text}</p>
)

// Long excerpts
const TrimmableExcerpt = withTextTrimming(
  (props) => <div className="text-sm">{props.text}</div>
)

// Usage
<TrimmableTitle text={longTitle} maxLength={100} />
<TrimmableDescription text={longDescription} maxLength={200} />
<TrimmableExcerpt text={longExcerpt} maxLength={500} />
```

### With Custom Styling

```tsx
const StyledTrimmableText = withTextTrimming(
  ({ text, className = '' }) => (
    <span className={`text-blue-600 ${className}`}>
      {text}
    </span>
  )
)
```

## Best Practices

1. **Consistent Lengths**: Use consistent maxLength values across similar content types
2. **Accessibility**: Ensure trimmed text doesn't break important information
3. **Performance**: The HOC is lightweight and doesn't impact performance
4. **TypeScript**: Always define proper interfaces for your component props

## Default Lengths

- **Titles**: 100-150 characters
- **Descriptions**: 200-250 characters  
- **Excerpts**: 350-400 characters
- **Full content**: No trimming (use original component) 