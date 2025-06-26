import { beforeEach, describe, expect, it, vi } from "vitest"
import * as TokenManager from "../../../src/features/auth/utils/TokenManager"
import {
  AuthReducer,
  logout,
  selectCurrentUser,
  selectIsAuthenticated,
  setCredentials,
} from "../../../src/redux/slices/AuthSlice"

// Mock the TokenManager functions
vi.mock("../../../src/features/auth/utils/TokenManager", () => {
  return {
    getTokenFromStorage: vi.fn().mockReturnValue({
      accessToken: "",
      refreshToken: "",
    }),
    saveTokensToStorage: vi.fn(),
    removeTokensFromStorage: vi.fn(),
    parseJwt: vi.fn().mockReturnValue({
      sub: "test-user-id",
      name: "Test User",
      user_type: 1,
    }),
  }
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
vi.stubGlobal("localStorage", localStorageMock)

describe("AuthSlice", () => {
  // Reset all mocks before each test
  beforeEach(() => {
    vi.resetAllMocks()

    // Ensure parseJwt always returns our test user
    const parseJwt = TokenManager.parseJwt as jest.Mock
    parseJwt.mockReturnValue({
      sub: "test-user-id",
      name: "Test User",
      user_type: 1,
    })
  })

  describe("reducer", () => {
    it("should return the initial state", () => {
      // Using parseJwt mock for initialState test
      const parseJwt = TokenManager.parseJwt as jest.Mock
      parseJwt.mockReturnValue(null)

      const initialState = {
        accessToken: "",
        refreshToken: "",
        isAuthenticated: false,
        userInfo: null,
      }

      expect(AuthReducer(undefined, { type: "unknown" })).toEqual(initialState)
    })

    it("should handle setCredentials", () => {
      const mockToken = {
        accessToken: "test-access-token",
        refreshToken: "test-refresh-token",
      }

      const expectedState = {
        accessToken: "test-access-token",
        refreshToken: "test-refresh-token",
        isAuthenticated: true,
        userInfo: {
          sub: "test-user-id",
          name: "Test User",
          user_type: 1,
        },
      }

      // Make sure parseJwt returns the expected value for this test
      const parseJwt = TokenManager.parseJwt as jest.Mock
      parseJwt.mockReturnValue({
        sub: "test-user-id",
        name: "Test User",
        user_type: 1,
      })

      const actual = AuthReducer(undefined, setCredentials(mockToken))
      expect(actual).toEqual(expectedState)
    })

    it("should handle logout", () => {
      // First set credentials to simulate a logged-in state
      const loggedInState = {
        accessToken: "test-access-token",
        refreshToken: "test-refresh-token",
        isAuthenticated: true,
        userInfo: {
          sub: "test-user-id",
          name: "Test User",
          user_type: 1,
        },
      }

      // Then logout
      const actual = AuthReducer(loggedInState, logout())

      expect(actual).toEqual({
        accessToken: "",
        refreshToken: "",
        isAuthenticated: false,
        userInfo: null,
      })
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        "available_clinic",
      )
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("choosen_clinic")
    })
  })

  describe("selectors", () => {
    it("should select the current user", () => {
      const mockState = {
        auth: {
          accessToken: "test-access-token",
          refreshToken: "test-refresh-token",
          isAuthenticated: true,
          userInfo: {
            sub: "test-user-id",
            name: "Test User",
            user_type: 1,
          },
        },
      }

      const selectedUser = selectCurrentUser(mockState)
      expect(selectedUser).toEqual({
        sub: "test-user-id",
        name: "Test User",
        user_type: 1,
      })
    })

    it("should select the authentication status", () => {
      const mockState = {
        auth: {
          accessToken: "test-access-token",
          refreshToken: "test-refresh-token",
          isAuthenticated: true,
          userInfo: {
            sub: "test-user-id",
            name: "Test User",
            user_type: 1,
          },
        },
      }

      const isAuthenticated = selectIsAuthenticated(mockState)
      expect(isAuthenticated).toBe(true)
    })
  })
})
