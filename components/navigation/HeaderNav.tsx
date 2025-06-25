import { Link } from "@/components/navigation/Link"
import { SearchBox } from "@/components/navigation/SearchBox"

export function HeaderNav() {
  return (
    <header>
      <div className="container flex items-center justify-between py-6 mx-auto">
        <Link href="/" className="text-2xl font-semibold no-underline">
          Next.js for Drupal
        </Link>
        <div className="flex items-center space-x-6">
          <SearchBox />
        </div>
      </div>
    </header>
  )
}
