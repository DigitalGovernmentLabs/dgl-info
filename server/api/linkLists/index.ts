import { LinkList } from '$/types'

export type Methods = {
  get: {
    resBody: LinkList[]
  }
  post: {
    reqBody: Pick<LinkList, 'listTitle'>
  }
}
