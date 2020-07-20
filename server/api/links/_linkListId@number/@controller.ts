import { createController } from './$relay'
import { createLink } from '$/service/links'

export default createController({
  post: async ({ body, params }) => {
    await createLink(body, params.linkListId)
    return { status: 201 }
  }
})
