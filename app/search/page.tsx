"use client"

import { useSearchParams } from "next/navigation"
import { useSearch } from "@/hooks/useSearch"
import { SearchResults } from "@/components/search/SearchResults"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q")
  
  const { results, loading, error, total } = useSearch(query)

  return (
    <SearchResults 
      results={results}
      loading={loading}
      error={error}
      total={total}
      query={query}
    />
  )
}
 