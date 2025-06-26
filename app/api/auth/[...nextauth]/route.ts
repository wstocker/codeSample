import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Check for required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.error("NEXTAUTH_SECRET is not set. Please add it to your .env.local file")
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "drupal",
      name: "Drupal",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }

        try {
          const drupalUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
          console.log("Attempting secure authentication with Drupal URL:", drupalUrl)
          
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

          console.log("Client token response status:", clientTokenResponse.status)

          if (!clientTokenResponse.ok) {
            const errorText = await clientTokenResponse.text()
            console.error("Client token request failed:", errorText)
            return null
          }

          const clientTokenData = await clientTokenResponse.json()
          console.log("Client token received successfully")

          // Step 2: Validate user credentials using Drupal's user login endpoint
          const loginResponse = await fetch(`${drupalUrl}/user/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              name: credentials.username,
              pass: credentials.password,
              form_id: 'user_login_form',
            }),
            redirect: 'manual', // Don't follow redirects
          })

          console.log("User login response status:", loginResponse.status)

          // Check if login was successful (Drupal redirects to user page on success)
          const location = loginResponse.headers.get('location')
          const isLoginSuccessful = (loginResponse.status === 302 || loginResponse.status === 303) && 
            location?.includes('/user/')

          if (!isLoginSuccessful) {
            console.error("User login failed - invalid credentials")
            console.error("Response status:", loginResponse.status)
            console.error("Location header:", location)
            return null
          }

          // Step 3: Extract user ID from the redirect location
          const userIdMatch = location?.match(/\/user\/(\d+)/)
          const userId = userIdMatch ? userIdMatch[1] : '1'
          
          console.log("User login successful, extracted user ID:", userId)
          
          // Step 4: Get user details using JSON:API with client token
          const userResponse = await fetch(`${drupalUrl}/jsonapi/user/user/${userId}`, {
            headers: {
              'Authorization': `Bearer ${clientTokenData.access_token}`,
              'Content-Type': 'application/vnd.api+json',
            },
          })

          let userData = null
          if (userResponse.ok) {
            userData = await userResponse.json()
            console.log("User data retrieved successfully")
          } else {
            console.log("User data retrieval failed, using fallback data")
          }
          
          return {
            id: userId,
            name: userData?.data?.attributes?.name || credentials.username,
            email: userData?.data?.attributes?.mail || `${credentials.username}@example.com`,
            accessToken: clientTokenData.access_token,
            refreshToken: clientTokenData.refresh_token || '',
          }

        } catch (error) {
          console.error('Secure authentication error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.userId = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.user.id = token.userId as string
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl + "/user/profile"
    }
  },
  pages: {
    signIn: '/user/login',
  },
  session: {
    strategy: "jwt",
  },
  debug: true, // Enable debug mode
})

export { handler as GET, handler as POST } 