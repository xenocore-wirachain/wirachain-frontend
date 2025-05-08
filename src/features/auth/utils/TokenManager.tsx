import type { TokenPayload } from "../types/Credentials"

export const parseJwt = (token: string): TokenPayload | null => {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(""),
    )

    return JSON.parse(jsonPayload) as TokenPayload
  } catch (error: unknown) {
    console.log(error)
    return null
  }
}

export const getTokenFromStorage = (): {
  accessToken: string
  refreshToken: string
} => {
  const accessToken = localStorage.getItem("accessToken") ?? ""
  const refreshToken = localStorage.getItem("refreshToken") ?? ""
  return { accessToken, refreshToken }
}

export const saveTokensToStorage = (
  accessToken: string,
  refreshToken: string,
): void => {
  localStorage.setItem("accessToken", accessToken)
  localStorage.setItem("refreshToken", refreshToken)
}

export const removeTokensFromStorage = (): void => {
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
}

export const isTokenExpired = (token: string): boolean => {
  const payload = parseJwt(token)
  if (!payload) return true

  const currentTime = Math.floor(Date.now() / 1000)
  return payload.exp < currentTime
}

export const getTokenPayload = (token: string): TokenPayload | null => {
  return parseJwt(token)
}
