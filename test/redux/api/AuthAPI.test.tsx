import { configureStore } from "@reduxjs/toolkit"
import { act, renderHook } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import type React from "react"
import { Provider } from "react-redux"
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"
import {
  authApi,
  useLoginMutation,
  useRefreshTokenMutation,
} from "../../../src/redux/api/AuthAPI"
import { API_URL } from "../../../src/utils/ApiPath"

// Mock the TokenManager module completely
vi.mock("../../../src/features/auth/utils/TokenManager", () => ({
  getTokenFromStorage: () => ({
    accessToken: "mocked-token-from-storage",
    refreshToken: "mocked-refresh-token-from-storage",
  }),
  setTokenToStorage: vi.fn(),
  removeTokenFromStorage: vi.fn(),
  parseJwt: vi.fn(token => ({
    sub: "user-id",
    name: "Test User",
    user_type: 1,
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
  })),
}))

// Also mock the AuthSlice to prevent it from trying to use TokenManager
vi.mock("../../../src/redux/slices/AuthSlice", () => {
  const actual = vi.importActual("../../../src/redux/slices/AuthSlice")
  return {
    ...actual,
    logout: () => ({ type: "auth/logout" }),
    setCredentials: payload => ({
      type: "auth/setCredentials",
      payload,
    }),
  }
})

// Setup MSW server
const server = setupServer()

// Start server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" })
})
// Reset handlers after each test
afterEach(() => {
  server.resetHandlers()
})
// Close server after all tests
afterAll(() => {
  server.close()
})

// Setup test store with initial auth state
function setupStore() {
  return configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      auth: (
        state = {
          accessToken: "test-access-token",
          refreshToken: "test-refresh-token",
          user: {
            id: "user-id",
            name: "Test User",
            user_type: 1,
          },
        },
      ) => state,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(authApi.middleware),
  })
}

// Wrapper for render hook
function wrapper({ children }: { children: React.ReactNode }) {
  const store = setupStore()
  return <Provider store={store}>{children}</Provider>
}

describe("AuthAPI", () => {
  beforeEach(() => {
    server.use(
      // Mock login endpoint
      http.post(`${API_URL}auth/login`, () => {
        return HttpResponse.json({
          accessToken: "mock-access-token",
          refreshToken: "mock-refresh-token",
          user: {
            id: "user-id",
            name: "Test User",
            user_type: 1,
          },
        })
      }),

      // Mock refresh token endpoint
      http.post(`${API_URL}auth/refresh`, () => {
        return HttpResponse.json({
          accessToken: "new-access-token",
          refreshToken: "new-refresh-token",
          user: {
            id: "user-id",
            name: "Test User",
            user_type: 1,
          },
        })
      }),
    )
  })

  describe("useLoginMutation", () => {
    it("should return access token and refresh token on successful login", async () => {
      const { result } = renderHook(() => useLoginMutation(), { wrapper })

      // Using act to wrap the mutation call
      await act(async () => {
        const [login] = result.current

        // Call the mutation
        await login({
          email: "test@example.com",
          password: "password123",
        })
          .unwrap()
          .catch(() => {
            // Catch any promise rejection
          })
      })

      // Check the final state after the mutation is complete
      expect(result.current[1].isSuccess).toBe(true)
      expect(result.current[1].data).toEqual({
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
        user: {
          id: "user-id",
          name: "Test User",
          user_type: 1,
        },
      })
    })

    it("should handle login errors", async () => {
      // Override the default handler for this test
      server.use(
        http.post(`${API_URL}auth/login`, () => {
          return new HttpResponse(
            JSON.stringify({ message: "Invalid credentials" }),
            { status: 401 },
          )
        }),
      )

      const { result } = renderHook(() => useLoginMutation(), { wrapper })

      // Using act to wrap the mutation call
      await act(async () => {
        const [login] = result.current

        // Call the mutation
        await login({
          email: "wrong@example.com",
          password: "wrongpass",
        })
          .unwrap()
          .catch(() => {
            // Catch any promise rejection
          })
      })

      // Check the final state after the mutation is complete
      expect(result.current[1].isError).toBe(true)
      expect(result.current[1].error).toBeDefined()
    })
  })

  describe("useRefreshTokenMutation", () => {
    it("should return new tokens when refreshing", async () => {
      const { result } = renderHook(() => useRefreshTokenMutation(), {
        wrapper,
      })

      // Using act to wrap the mutation call
      await act(async () => {
        const [refreshToken] = result.current

        // Call the mutation
        await refreshToken({
          refreshToken: "old-refresh-token",
        })
          .unwrap()
          .catch(() => {
            // Catch any promise rejection
          })
      })

      // Check the final state after the mutation is complete
      expect(result.current[1].isSuccess).toBe(true)
      expect(result.current[1].data).toEqual({
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
        user: {
          id: "user-id",
          name: "Test User",
          user_type: 1,
        },
      })
    })

    it("should handle refresh token errors", async () => {
      // Override the default handler for this test
      server.use(
        http.post(`${API_URL}auth/refresh`, () => {
          return new HttpResponse(
            JSON.stringify({ message: "Invalid refresh token" }),
            { status: 403 },
          )
        }),
      )

      const { result } = renderHook(() => useRefreshTokenMutation(), {
        wrapper,
      })

      // Using act to wrap the mutation call
      await act(async () => {
        const [refreshToken] = result.current

        // Call the mutation
        await refreshToken({
          refreshToken: "invalid-refresh-token",
        })
          .unwrap()
          .catch(() => {
            // Catch any promise rejection
          })
      })

      // Check the final state after the mutation is complete
      expect(result.current[1].isError).toBe(true)
      expect(result.current[1].error).toBeDefined()
    })
  })
})
