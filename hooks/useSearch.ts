import { useState, useEffect } from "react"
import type { SearchResult, SearchResponse, UseSearchReturn } from "@/types/search"

export function useSearch(query: string | null): UseSearchReturn {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!query) {
      setResults([])
      setTotal(0)
      setError(null)
      return
    }

    const fetchSearchResults = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/search/search?q=${encodeURIComponent(query)}`, {
          method: 'GET',
        })

        if (!response.ok) {
          throw new Error("Failed to fetch search results")
        }

        const data: SearchResponse = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }

        setResults(data.results || [])
        setTotal(data.total || 0)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error("Search error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSearchResults()
  }, [query])

  return {
    results,
    loading,
    error,
    total,
    query
  }
} 