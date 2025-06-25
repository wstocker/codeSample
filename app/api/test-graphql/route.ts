import { NextRequest, NextResponse } from 'next/server'
import { drupal } from '@/lib/drupal'

export async function GET() {
  try {
    console.log('Testing GraphQL connection...')
    console.log('Base URL:', process.env.NEXT_PUBLIC_DRUPAL_BASE_URL)
    
    // Get all available query fields
    const schemaQuery = `
      query {
        __schema {
          queryType {
            name
            fields {
              name
              type {
                name
              }
            }
          }
        }
      }
    `

    const data = await drupal.query({
      query: schemaQuery
    })

    return NextResponse.json({
      success: true,
      data,
      message: 'GraphQL schema retrieved successfully'
    })

  } catch (error) {
    console.error('GraphQL test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, variables } = body

    if (!query) {
      return NextResponse.json({
        success: false,
        error: 'Query is required'
      }, { status: 400 })
    }

    console.log('Executing GraphQL query:', query.substring(0, 100) + '...')

    const data = await drupal.query({
      query,
      variables
    })

    // Wrap in { data } for GraphQL codegen compatibility
    return NextResponse.json({ data })

  } catch (error) {
    console.error('GraphQL query failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 