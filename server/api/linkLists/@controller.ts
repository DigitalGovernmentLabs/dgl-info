import { createController } from './$relay'
import { linkListRepository } from '$/service/linkLists'

export default createController({
  get: async () => ({
    status: 200,
    body: await linkListRepository.getLinkLists()
  }),
  post: async ({ body }) => {
    const linkLists = await linkListRepository.createLinkLists(body.listTitle)
    return { status: 201, body: linkLists }
  }
})
