import { Link, LinkList } from '$/types'

export type Methods = {
  post: {
    reqBody: Omit<Link, 'linkId' | 'linkOrder'>
    resBody: LinkList
  }
}
