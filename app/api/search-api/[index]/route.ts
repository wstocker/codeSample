import { NextRequest, NextResponse } from 'next/server'
import { drupal } from '../../../../lib/drupal-search'

export async function POST(
  request: NextRequest,
  { params }: { params: { index: string } }
) {
  try {
    const body = await request.json()
    const { index } = params

    const results = await drupal.getSearchIndex(index, body)

    return NextResponse.json(results)
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch search results',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    )
  }
}

// Also support GET requests for simple searches
export async function GET(
  request: NextRequest,
  { params }: { params: { index: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const { index } = params

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 })
    }

    const results = await drupal.getSearchIndex(index, {
      params: {
        filter: { fulltext: query }
      }
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch search results',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    )
  }
} 