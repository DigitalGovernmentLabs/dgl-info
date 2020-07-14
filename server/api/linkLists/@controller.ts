import { createController } from './$relay'
import { findAllLists, createLinkList } from '$/service/linkLists'

export default createController({
  get: async () => ({
    status: 200,
    body: await findAllLists()
  }),
  post: async ({ body }) => {
    const linkLists = await createLinkList(body.listTitle)
    return { status: 201, body: linkLists }
  }
})
