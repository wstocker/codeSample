import { NextApiRequest, NextApiResponse } from "next"
import { DrupalNode } from "next-drupal"

import { drupal } from "lib/drupal"

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const body = JSON.parse(request.body)

    const { index } = request.query

    const results = await drupal.getSearchIndex<DrupalNode>(
      index as string,
      body
    )

    response.json(results)
  } catch (error) {
    return response.status(400).json(error.message)
  }
}
