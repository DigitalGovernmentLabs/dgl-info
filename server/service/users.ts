import { API_ORIGIN, BASE_PATH, USER_ID, USER_PASS } from './envValues'

const iconsDir = 'public/icons'
const createIconURL = (name: string) =>
  `${API_ORIGIN}${BASE_PATH}/icons/${name}`

let userToken: string | null = null

export const validateUser = (id: string, pass: string) =>
  id === USER_ID && pass === USER_PASS

export const validateToken = (token: string) =>
  userToken !== null && token === userToken

export const getUserIdByToken = (token: string) =>
  validateToken(token) && { id: USER_ID }

export const createToken = () => {
  userToken = `token:${Date.now()}`
  return userToken
}

export const deleteToken = (token: string) => {
  if (validateToken(token)) userToken = null
}
