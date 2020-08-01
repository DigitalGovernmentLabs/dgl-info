import { createController } from './$relay'
import { findAllLists, createLinkList } from '$/service/linkLists'

export default createController({
  get: async () => ({
    status: 200,
    body: await findAllLists()
  }),
  post: async ({ body }) => {
    await createLinkList(body.listTitle)
    return { status: 204 }
  }
})
