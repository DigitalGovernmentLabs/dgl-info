import { createController } from './$relay'
import { createLink, removeLink, updateLink } from '$/service/links'

export default createController({
  post: async ({ params, body }) => {
    await createLink(params.linkListId, body)
    return { status: 204 }
  },
  patch: async ({ body }) => {
    await updateLink(body)
    return { status: 204 }
  },
  delete: async ({ body }) => {
    await removeLink(body)
    return { status: 204 }
  }
})
