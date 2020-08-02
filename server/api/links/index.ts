import { PickLink } from '$/types'

export type Methods = {
  post: {
    reqBody: { listId: number; pickLink: PickLink }
    status: 204
  }
}
