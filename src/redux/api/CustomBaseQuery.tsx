import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react"
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { Mutex } from "async-mutex"
import { getTokenFromStorage } from "../../features/auth/utils/TokenManager"
import { API_URL } from "../../utils/ApiPath"
import type { RootState } from "../index"
import { logout, setCredentials } from "../slices/AuthSlice"

const mutex = new Mutex()

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken

    if (!token) {
      const { accessToken } = getTokenFromStorage()
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`)
      }
    } else {
      headers.set("Authorization", `Bearer ${token}`)
    }

    return headers
  },
})

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock()

  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 403) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()

      try {
        const state = api.getState() as RootState
        const refreshToken =
          state.auth.refreshToken || getTokenFromStorage().refreshToken

        if (!refreshToken) {
          api.dispatch(logout())
          return result
        }

        const refreshResult = await baseQuery(
          {
            url: "auth/refresh",
            method: "POST",
            body: { refreshToken },
          },
          api,
          extraOptions,
        )

        if (refreshResult.data) {
          const tokens = refreshResult.data as {
            accessToken: string
            refreshToken: string
          }
          api.dispatch(setCredentials(tokens))

          result = await baseQuery(args, api, extraOptions)
        } else {
          api.dispatch(logout())
        }
      } finally {
        release()
      }
    } else {
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }

  return result
}
