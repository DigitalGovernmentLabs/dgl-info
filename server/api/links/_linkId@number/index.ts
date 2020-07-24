import { PartialLink } from '$/types'

export type Methods = {
  patch: {
    reqBody: PartialLink
    status: 204
  }
  delete: {
    status: 204
  }
}
