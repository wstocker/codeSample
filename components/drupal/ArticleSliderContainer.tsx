import { ArticleSliderClient } from "./ArticleSliderClient"
import { drupal } from "@/lib/drupal"
import { DrupalArticle } from "@/types"

interface ArticleSliderContainerProps {
  // title property is optional
  title?: string
}

export async function ArticleSliderContainer({
  title = "Latest Articles",
}: ArticleSliderContainerProps) {
  try {
    // Fetch articles server-side
    const data = await drupal.query<{
      nodeArticles: {
        nodes: DrupalArticle[]
      }
    }>({
      query: `
        query GetLatestArticles {
          nodeArticles(first: 6, sortKey: CREATED_AT, reverse: true) {
            nodes {
              __typename
              id
              title
              path
              body {
                processed
              }
              status
              created {
                time
              }
              author {
                name
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

    const articles = data?.nodeArticles?.nodes || []

    return <ArticleSliderClient articles={articles} title={title} />
  } catch (error) {
    console.error("Error fetching articles from Drupal:", error)
  }
}
