import { Link } from '$/types'

export type Methods = {
  post: {
    reqBody: Pick<Link, 'url' | 'name' | 'description'>
  }
}
