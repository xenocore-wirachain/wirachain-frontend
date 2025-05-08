import { createApi } from "@reduxjs/toolkit/query/react"
import type {
  LoginRequest,
  LoginResponse,
} from "../../features/auth/types/Credentials"
import { baseQueryWithReauth } from "./CustomBaseQuery"

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: credentials => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    refreshToken: builder.mutation<LoginResponse, { refreshToken: string }>({
      query: refreshData => ({
        url: "auth/refresh",
        method: "POST",
        body: refreshData,
      }),
    }),
  }),
})

export const { useLoginMutation, useRefreshTokenMutation } = authApi
