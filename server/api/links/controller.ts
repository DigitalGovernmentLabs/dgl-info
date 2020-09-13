import { defineController } from './$relay'
import { createLink } from '$/service/links'

export default defineController(() => ({
  post: async ({ body }) => {
    await createLink(body.listId, body.pickLink)
    return { status: 204 }
  }
}))
