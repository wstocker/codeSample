"use client"

import { useSession, signOut } from "next-auth/react"
import { Link } from "@/components/navigation/Link"
import { SearchBox } from "@/components/navigation/SearchBox"

export function HeaderNav() {
  const { data: session, status } = useSession()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container flex items-center justify-between py-4 mx-auto px-6">
        <Link href="/" className="text-2xl font-semibold no-underline text-gray-900 hover:text-gray-700">
          Next.js for Drupal
        </Link>
        
        <nav className="flex items-center space-x-8">
          <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium">
            Home
          </Link>
          
          <div className="flex items-center space-x-4">
            <SearchBox />
            
            {status === "loading" ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <Link href="/user/profile" className="text-gray-600 hover:text-gray-900 font-medium">
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Logout
                </button>
              </div>
            ) : (
        <Link
                href="/user/login" 
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
        </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
