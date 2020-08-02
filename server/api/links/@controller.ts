import { createController } from './$relay'
import { createLink } from '$/service/links'

export default createController({
  post: async ({ body }) => {
    await createLink(body.listId, body.pickLink)
    return { status: 204 }
  }
})
