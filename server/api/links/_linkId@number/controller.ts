import { defineController } from './$relay'
import { deleteLink, updateLink } from '$/service/links'

export default defineController(() => ({
  patch: async ({ params, body }) => {
    await updateLink(params.linkId, body)
    return { status: 204 }
  },
  delete: async ({ params }) => {
    await deleteLink(params.linkId)
    return { status: 204 }
  }
}))
