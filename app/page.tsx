import { ArticleTeaser } from "@/components/drupal/ArticleTeaser"
import { ArticleSliderContainer } from "@/components/drupal/ArticleSliderContainer"
import { drupal } from "@/lib/drupal"
import type { Metadata } from "next"
import type { DrupalArticle } from "@/types"

export const metadata: Metadata = {
  description: "A Next.js site powered by a Drupal backend.",
}

export default async function Home() {
  let nodes: DrupalArticle[] = []

  try {
    const data = await drupal.query<{
      nodeArticles: {
        nodes: DrupalArticle[]
      }
    }>({
      query: `
        query {
          nodeArticles(first: 10) {
            nodes {
              id
              title
              path
              author {
                name
              }
              body {
                processed
              }
              created {
                time
              }
              image {
                width
                url
                height
              }
            }
          }
        }
      `,
    })

    nodes = data?.nodeArticles?.nodes ?? []
  } catch (error) {
    console.error("Error fetching articles from Drupal:", error)
  }

  return (
    <>
      <h1 className="mb-10 text-6xl text-pink-500">Latest Articles.</h1>
      
      {nodes?.length ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {nodes.slice(0, 6).map((node) => (
            <ArticleTeaser key={node.id} node={node} />
          ))}
        </div>
      ) : (
        <p>No articles to display.</p>
      )}
      
      {/* Article Slider with State Lifting Demo */}
      <div className="mb-16">
        <ArticleSliderContainer title="Featured Articles" />
      </div>
    </>
  )
}
