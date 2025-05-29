import type { UUID } from "crypto"

export type Tokens = {
  accessToken: string
  refreshToken: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  accessToken: string
  refreshToken: string
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
