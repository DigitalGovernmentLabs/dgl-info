import { createController } from './$relay'
import { findOneList } from '$/service/linkLists'

export default createController({
  post: async ({ params }) => {
    const list = await findOneList(params.linkListId)
    return {
      status: 201,
      body: list
    }
  }
})

// import { createController } from './$relay'
// import { createLink } from '$/service/links'
// import { LinkList } from '$/types'

// export default createController({
// post: async ({ body, params })=> {
//   const links = await createLink(body, params.linkListId)
//   return { status: 201, body: links }
// }
// })
