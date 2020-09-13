import { UserInfo } from '$/types'
import { TokenHeader } from '$/validators'

export type Methods = {
  get: {
    reqHeaders: TokenHeader
    resBody: UserInfo
  }

  post: {
    reqHeaders: TokenHeader
    reqFormat: FormData
    reqBody: { icon: Blob }
    resBody: UserInfo
  }
}
