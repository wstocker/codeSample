import { NextRequest, NextResponse } from 'next/server'
import { drupal } from '../../../../lib/drupal-search'

// Utility function for text trimming
function trimText(text: string, maxLength: number = 350): string {
  if (!text) return ''
  return text.length > maxLength 
    ? text.substring(0, maxLength).trim() + '...'
    : text
}

export async function POST(
  request: NextRequest,
  { params }: { params: { index: string } }
) {
  try {
    const body = await request.json()
    const { index } = params

    const searchResponse = await drupal.getSearchIndex(index, body)
    
    // Handle both array and object responses from Search API
    const data = Array.isArray(searchResponse) ? searchResponse : (searchResponse as any).data || []
    const meta = Array.isArray(searchResponse) ? null : (searchResponse as any).meta
    
    // Transform the Search API response to match frontend expectations
    const results = data.map((item: any) => ({
      id: item.id,
      title: item.title || 'Untitled',
      url: `/node/${item.drupal_internal__nid || item.id}`,
      excerpt: trimText(item.body?.summary || item.body?.value || 'No excerpt available', 350),
      type: item.type?.replace('node--', '') || 'unknown',
      created: item.created || item.changed || new Date().toISOString()
    }))

    return NextResponse.json({
      results,
      query: body.params?.filter?.fulltext || '',
      total: meta?.count || results.length
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    )
  }
} 