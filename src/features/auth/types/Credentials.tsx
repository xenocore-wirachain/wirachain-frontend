import type { UUID } from "crypto"

export type Tokens = {
  accessToken: string
  refreshToken: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type LoginBase = {
  accessToken: string
  refreshToken: string
  email: string
  userId: string
  firstName: string
  lastName: string
}

export type LoginResponse = {
  data: LoginBase
  success: boolean
  message: string
}

export type OriginalPayload = {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": UUID
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string
  userType: string
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string[]
}

export type TokenPayload = {
  id: UUID
  name: string
  user_type: number
}

export type RefreshTokenRequest = {
  refreshToken: string
}

export type ForgotPassword = {
  email: string
}

export type AuthState = Tokens & {
  isAuthenticated: boolean
  userInfo: TokenPayload | null
}
