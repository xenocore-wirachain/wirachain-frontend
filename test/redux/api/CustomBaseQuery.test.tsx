import { beforeEach, describe, expect, it, vi } from "vitest"

// Define all mocks first using vi.hoisted
const mocks = vi.hoisted(() => {
  return {
    // Mock for fetchBaseQuery
    baseQueryMock: vi.fn(),

    // Mock for TokenManager
    getTokenFromStorage: vi.fn().mockReturnValue({
      accessToken: "mocked-token-from-storage",
      refreshToken: "mocked-refresh-token-from-storage",
    }),
    setTokenToStorage: vi.fn(),
    removeTokenFromStorage: vi.fn(),
    parseJwt: vi.fn(() => ({
      sub: "user-id",
      name: "Test User",
      user_type: 1,
      exp: Math.floor(Date.now() / 1000) + 3600,
    })),

    // Mock for AuthSlice
    logout: vi.fn(),
    setCredentials: vi.fn(),

    // Mock for Mutex
    mutexIsLocked: false,
    mutexWaitForUnlock: vi.fn().mockResolvedValue(undefined),
    mutexAcquire: vi.fn(),
    mutexRelease: vi.fn(),
  }
})

// Set up all mocks in one place
vi.mock("@reduxjs/toolkit/query/react", () => {
  return {
    fetchBaseQuery: vi.fn(() => mocks.baseQueryMock),
    BaseQueryFn: vi.fn(),
    createApi: vi.fn(),
  }
})

vi.mock("../../../src/features/auth/utils/TokenManager", () => {
  return {
    getTokenFromStorage: mocks.getTokenFromStorage,
    setTokenToStorage: mocks.setTokenToStorage,
    removeTokenFromStorage: mocks.removeTokenFromStorage,
    parseJwt: mocks.parseJwt,
  }
})

vi.mock("../../../src/redux/slices/AuthSlice", () => {
  return {
    logout: mocks.logout,
    setCredentials: mocks.setCredentials,
  }
})

vi.mock("async-mutex", () => {
  // Pre-configure the mutex mock behavior
  mocks.mutexAcquire.mockImplementation(() => {
    mocks.mutexIsLocked = true
    return Promise.resolve(mocks.mutexRelease)
  })

  mocks.mutexRelease.mockImplementation(() => {
    mocks.mutexIsLocked = false
  })

  return {
    Mutex: vi.fn(() => ({
      isLocked: () => mocks.mutexIsLocked,
      waitForUnlock: mocks.mutexWaitForUnlock,
      acquire: mocks.mutexAcquire,
    })),
  }
})

// Now import the module under test
import type { BaseQueryApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth } from "../../../src/redux/api/CustomBaseQuery"

describe("CustomBaseQuery", () => {
  // Define test variables
  let mockApi: BaseQueryApi
  let mockExtraOptions: Record<string, unknown>

  beforeEach(() => {
    // Reset all mocks
    vi.resetAllMocks()

    // Reset mock state
    mocks.mutexIsLocked = false

    // Restore default mock implementations
    mocks.getTokenFromStorage.mockReturnValue({
      accessToken: "mocked-token-from-storage",
      refreshToken: "mocked-refresh-token-from-storage",
    })

    mocks.mutexAcquire.mockImplementation(() => {
      mocks.mutexIsLocked = true
      return Promise.resolve(mocks.mutexRelease)
    })

    // Set up API mock
    mockApi = {
      dispatch: vi.fn(),
      getState: vi.fn(() => ({
        auth: {
          accessToken: "test-access-token",
          refreshToken: "test-refresh-token",
        },
      })),
    }

    mockExtraOptions = {}
  })

  it("should pass through successful responses", async () => {
    // Set up successful response
    mocks.baseQueryMock.mockResolvedValueOnce({
      data: { result: "success" },
    })

    // Call baseQueryWithReauth
    const result = await baseQueryWithReauth(
      { url: "test" },
      mockApi,
      mockExtraOptions,
    )

    // Verify result
    expect(result).toEqual({ data: { result: "success" } })
  })

  it("should attempt token refresh when receiving a 403 error", async () => {
    // First call returns 403 error
    mocks.baseQueryMock.mockResolvedValueOnce({
      error: { status: 403 },
    })

    // Refresh token call succeeds
    mocks.baseQueryMock.mockResolvedValueOnce({
      data: {
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
      },
    })

    // Final call with new token succeeds
    mocks.baseQueryMock.mockResolvedValueOnce({
      data: { result: "success-after-refresh" },
    })

    // Call baseQueryWithReauth
    const result = await baseQueryWithReauth(
      { url: "test" },
      mockApi,
      mockExtraOptions,
    )

    // Verify the refresh token request
    const refreshCall = mocks.baseQueryMock.mock.calls[1][0]
    expect(refreshCall).toMatchObject({
      url: "auth/refresh",
      method: "POST",
      body: { refreshToken: "test-refresh-token" },
    })

    // Verify setCredentials was dispatched
    expect(mockApi.dispatch).toHaveBeenCalledWith(
      mocks.setCredentials({
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
      }),
    )

    // Verify final result
    expect(result).toEqual({ data: { result: "success-after-refresh" } })
  })

  it("should logout when refresh token is not available", async () => {
    // First call returns 403 error
    mocks.baseQueryMock.mockResolvedValueOnce({
      error: { status: 403 },
    })

    // Mock state with no refresh token
    mockApi.getState = vi.fn(() => ({
      auth: { accessToken: "test-access-token" }, // No refresh token
    }))

    // Mock getTokenFromStorage to return no refresh token
    mocks.getTokenFromStorage.mockReturnValueOnce({
      accessToken: "mocked-token-from-storage",
      // No refresh token
    })

    // Call baseQueryWithReauth
    await baseQueryWithReauth({ url: "test" }, mockApi, mockExtraOptions)

    // Verify logout was dispatched
    expect(mockApi.dispatch).toHaveBeenCalledWith(mocks.logout())
  })

  it("should logout when refresh token call fails", async () => {
    // First call returns 403 error
    mocks.baseQueryMock.mockResolvedValueOnce({
      error: { status: 403 },
    })

    // Refresh token call fails
    mocks.baseQueryMock.mockResolvedValueOnce({
      error: { status: 401, data: { message: "Invalid refresh token" } },
    })

    // Call baseQueryWithReauth
    await baseQueryWithReauth({ url: "test" }, mockApi, mockExtraOptions)

    // Verify logout was dispatched
    expect(mockApi.dispatch).toHaveBeenCalledWith(mocks.logout())
  })
})
