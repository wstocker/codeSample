import { NextRequest, NextResponse } from 'next/server'
import { drupal } from '../../../../lib/drupal-search'

// Utility function for text trimming
function trimText(text: string, maxLength: number = 350): string {
  if (!text) return ''
  return text.length > maxLength 
    ? text.substring(0, maxLength).trim() + '...'
    : text
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ index: string }> }
) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const { index } = await params

    // Make direct request to Drupal's JSON:API search endpoint
    const searchUrl = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/index/${index}?filter%5Bfulltext%5D=${encodeURIComponent(query)}`
    
    const response = await fetch(searchUrl, {
      headers: {
        'Accept': 'application/vnd.api+json',
      },
    })

    if (!response.ok) {
      throw new Error(`Search request failed: ${response.status}`)
    }

    const searchResponse = await response.json()
    const data = searchResponse.data || []
    const meta = searchResponse.meta
    
    // Transform the Search API response to match frontend expectations
    const results = data.map((item: any) => ({
      id: item.id,
      title: item.attributes?.title || 'Untitled',
      url: `/node/${item.attributes?.drupal_internal__nid || item.id}`,
      excerpt: trimText(item.attributes?.body?.summary || item.attributes?.body?.value || 'No excerpt available', 350),
      type: item.type?.replace('node--', '') || 'unknown',
      created: item.attributes?.created || item.attributes?.changed || new Date().toISOString()
    }))

    return NextResponse.json({
      results,
      query,
      total: meta?.count || results.length
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    )
  }
} 