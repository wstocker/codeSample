import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const drupalUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
    console.log('Attempting enhanced auth with:', { username, drupalUrl })

    // Step 1: Get client token using client_credentials grant
    const clientTokenResponse = await fetch(`${drupalUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.DRUPAL_CLIENT_ID!,
        client_secret: process.env.DRUPAL_CLIENT_SECRET!,
      }),
    })

    console.log('Client token response status:', clientTokenResponse.status)

    if (!clientTokenResponse.ok) {
      const errorText = await clientTokenResponse.text()
      console.error('Client token request failed:', errorText)
      return NextResponse.json(
        { error: 'Failed to authenticate with Drupal' },
        { status: 401 }
      )
    }

    const clientTokenData = await clientTokenResponse.json()
    console.log('Client token received successfully')

    // Step 2: Validate user credentials using Drupal's user login endpoint
    const loginResponse = await fetch(`${drupalUrl}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        name: username,
        pass: password,
        form_id: 'user_login_form',
      }),
      redirect: 'manual', // Don't follow redirects
    })

    console.log('User login response status:', loginResponse.status)
    console.log('User login response headers:', Object.fromEntries(loginResponse.headers.entries()))

    // Check if login was successful (Drupal redirects to user page on success)
    // Drupal returns 303 (See Other) and redirects to /user/{uid}?check_logged_in=1
    const location = loginResponse.headers.get('location')
    const isLoginSuccessful = (loginResponse.status === 302 || loginResponse.status === 303) && 
      location?.includes('/user/')

    if (!isLoginSuccessful) {
      console.error('User login failed - invalid credentials')
      console.error('Response status:', loginResponse.status)
      console.error('Location header:', location)
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Step 3: Extract user ID from the redirect location
    // Location format: /user/{uid}?check_logged_in=1
    const userIdMatch = location?.match(/\/user\/(\d+)/)
    const userId = userIdMatch ? userIdMatch[1] : '1'
    
    console.log('User login successful, extracted user ID:', userId)
    
    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        name: username,
        email: `${username}@example.com`, // We'll get this from user lookup if needed
        roles: [], // We'll get this from user lookup if needed
      },
      accessToken: clientTokenData.access_token,
      message: 'Authentication successful - user verified via login'
    })

  } catch (error) {
    console.error('Enhanced auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 