import { createController } from './$relay'
import { removeLink, updateLink } from '$/service/links'

export default createController({
  patch: async ({ body, params }) => {
    await updateLink(params.linkId, body)
    return { status: 204 }
  },
  delete: async ({ params }) => {
    await removeLink(params.linkId)
    return { status: 204 }
  }
})
