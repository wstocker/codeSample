import { NextRequest, NextResponse } from 'next/server'

interface SearchApiResult {
  nid: string
  title: string
  type: string
  body?: string
  url: string
  created: string
}

interface SearchApiResponse {
  results: SearchApiResult[]
  total: number
  query: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 })
  }

  try {
    const drupalUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://drupal-site.ddev.site'
    
    // Search API endpoint (you'll need to create this Views REST export)
    const searchApiUrl = `${drupalUrl}/search-api-rest?keys=${encodeURIComponent(query)}`
    
    console.log('Searching via Search API:', searchApiUrl)

    const response = await fetch(searchApiUrl)

    if (!response.ok) {
      console.error('Search API response error:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'Search API not available or misconfigured' },
        { status: 500 }
      )
    }

    const data = await response.json()
    
    // Transform the results to match our expected format
    const results = data.map((item: any) => ({
      id: item.nid || item.id,
      title: item.title,
      url: item.url || `${drupalUrl}/node/${item.nid}`,
      excerpt: item.body ? 
        item.body.replace(/<[^>]*>/g, '').substring(0, 200) + '...' : 
        'No excerpt available',
      type: item.type ? 
        item.type.charAt(0).toUpperCase() + item.type.slice(1) : 
        'Content',
      created: item.created || item.changed || ''
    }))

    return NextResponse.json({
      results,
      query,
      total: results.length,
      articlesCount: results.filter((r: any) => r.type === 'Article').length,
      pagesCount: results.filter((r: any) => r.type === 'Page').length
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch search results from Search API',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 