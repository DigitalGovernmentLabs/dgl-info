import { Link, PickLink } from '$/types'

export type Methods = {
  post: {
    reqBody: PickLink
  }
  patch: {
    reqBody: Link
    status: 204
  }
  delete: {
    reqBody: Link
    status: 204
  }
}
