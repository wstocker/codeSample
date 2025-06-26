import { SearchExcerpt } from "./SearchExcerpt"
import type { SearchResultsProps } from "@/types/search"

export function SearchResults({ results, loading, error, total, query }: SearchResultsProps) {
  if (!query) {
    return (
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-4">Search</h1>
        <p>Please enter a search query.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>

      {total > 0 && (
        <p className="text-gray-600 mb-6">
          Found {total} result{total !== 1 ? "s" : ""}
        </p>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2">Searching...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      {!loading && !error && results.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No results found for "{query}"</p>
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="space-y-6">
          {results.map((result) => (
            <div
              key={result.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">
                <a
                  href={result.url}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {result.title}
                </a>
              </h2>
              <SearchExcerpt 
                text={result.excerpt} 
                query={query}
                maxLength={350}
              />
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {result.type}
                </span>
                {result.created && (
                  <span>{new Date(result.created).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 