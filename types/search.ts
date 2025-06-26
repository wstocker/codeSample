export interface SearchResult {
  id: string
  title: string
  url: string
  excerpt: string
  type: string
  created: string
}

export interface SearchResponse {
  results: SearchResult[]
  query: string
  total: number
  error?: string
}

export interface UseSearchReturn {
  results: SearchResult[]
  loading: boolean
  error: string | null
  total: number
  query: string | null
}

export interface SearchResultsProps {
  results: SearchResult[]
  loading: boolean
  error: string | null
  total: number
  query: string | null
} 