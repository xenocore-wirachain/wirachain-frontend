import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import type { AuthState, Tokens } from "../../features/auth/types/Credentials"
import {
  getTokenFromStorage,
  parseJwt,
  removeTokensFromStorage,
  saveTokensToStorage,
} from "../../features/auth/utils/TokenManager"

const storedTokens = getTokenFromStorage()

const initialState: AuthState = {
  accessToken: storedTokens.accessToken || "",
  refreshToken: storedTokens.refreshToken || "",
  isAuthenticated: !!storedTokens.accessToken,
  userInfo: storedTokens.accessToken
    ? parseJwt(storedTokens.accessToken)
    : null,
}

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<Tokens>) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.isAuthenticated = true
      state.userInfo = parseJwt(action.payload.accessToken)

      saveTokensToStorage(
        action.payload.accessToken,
        action.payload.refreshToken,
      )
    },
    logout: state => {
      state.accessToken = ""
      state.refreshToken = ""
      state.isAuthenticated = false
      state.userInfo = null

      removeTokensFromStorage()
      localStorage.removeItem("available_clinic")
      localStorage.removeItem("choosen_clinic")
    },
  },
})

export const { setCredentials, logout } = AuthSlice.actions
export const AuthReducer = AuthSlice.reducer

export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.userInfo
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated
