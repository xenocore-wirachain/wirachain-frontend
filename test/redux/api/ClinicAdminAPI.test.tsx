import { configureStore } from "@reduxjs/toolkit"
import { act, renderHook, waitFor } from "@testing-library/react"
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
  clinicAdminApi,
  useAddClinicAdminMutation,
  useDeleteClinicAdminMutation,
  useGetAllClinicAdminsQuery,
  useGetClinicAdminQuery,
  useUpdateClinicAdminMutation,
} from "../../../src/redux/api/ClinicAdminAPI"
import { API_URL, BASE_PATH } from "../../../src/utils/ApiPath"

// Mock TokenManager to avoid dependency issues
vi.mock("../../../src/features/auth/utils/TokenManager", () => ({
  getTokenFromStorage: () => ({
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
}))

// Setup MSW server
const server = setupServer()
const CLINIC_ADMIN_PATH = BASE_PATH.clinicAdministration

// Mock data
const mockClinicAdmins = {
  results: [
    {
      id: "admin-id-1",
      firstName: "Admin",
      lastName: "One",
      email: "admin.one@example.com",
    },
    {
      id: "admin-id-2",
      firstName: "Admin",
      lastName: "Two",
      email: "admin.two@example.com",
    },
  ],
  pageIndex: 1,
  pageSize: 10,
  totalCount: 2,
  totalPages: 1,
}

const mockClinicAdmin = {
  id: "admin-id-1",
  firstName: "Admin",
  lastName: "One",
  email: "admin.one@example.com",
}

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

// Setup test store
function setupStore() {
  return configureStore({
    reducer: {
      [clinicAdminApi.reducerPath]: clinicAdminApi.reducer,
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
      getDefaultMiddleware().concat(clinicAdminApi.middleware),
  })
}

// Wrapper for render hook
function wrapper({ children }: { children: React.ReactNode }) {
  const store = setupStore()
  return <Provider store={store}>{children}</Provider>
}

describe("ClinicAdminAPI", () => {
  beforeEach(() => {
    server.use(
      // Get all clinic admins
      http.get(`${API_URL}${CLINIC_ADMIN_PATH}/page`, ({ request }) => {
        const url = new URL(request.url)
        const pageIndex = url.searchParams.get("pageIndex") ?? "1"
        const pageSize = url.searchParams.get("pageSize") ?? "10"
        const searchTerm = url.searchParams.get("searchTerm") ?? ""

        let results = [...mockClinicAdmins.results]
        if (searchTerm) {
          results = results.filter(
            admin =>
              `${admin.firstName} ${admin.lastName}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              admin.email.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        }

        return HttpResponse.json({
          ...mockClinicAdmins,
          pageIndex: Number(pageIndex),
          pageSize: Number(pageSize),
          results,
        })
      }),

      // Get single clinic admin
      http.get(`${API_URL}${CLINIC_ADMIN_PATH}/:id`, ({ params }) => {
        const id = params.id
        if (id === "admin-id-1") {
          return HttpResponse.json(mockClinicAdmin)
        }
        return new HttpResponse(null, { status: 404 })
      }),

      // Add clinic admin
      http.post(`${API_URL}${CLINIC_ADMIN_PATH}`, async ({ request }) => {
        const body = await request.json()
        const response = {
          id: "admin-id-3",
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
        }
        return HttpResponse.json(response)
      }),

      // Update clinic admin
      http.put(
        `${API_URL}${CLINIC_ADMIN_PATH}/:id`,
        async ({ params, request }) => {
          const id = params.id
          const body = await request.json()
          const response = {
            id,
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
          }
          return HttpResponse.json(response)
        },
      ),

      // Delete clinic admin
      http.delete(`${API_URL}${CLINIC_ADMIN_PATH}/:id`, () => {
        return HttpResponse.json(null)
      }),
    )
  })

  describe("useGetAllClinicAdminsQuery", () => {
    it("should return all clinic admins", async () => {
      const { result } = renderHook(
        () => useGetAllClinicAdminsQuery({ page: 1, pageSize: 10, search: "" }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true), {
        timeout: 5000,
      })

      expect(result.current.data).toEqual(mockClinicAdmins)
    })

    it("should filter clinic admins by search term", async () => {
      const { result } = renderHook(
        () =>
          useGetAllClinicAdminsQuery({ page: 1, pageSize: 10, search: "two" }),
        { wrapper },
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true), {
        timeout: 5000,
      })

      expect(result.current.data?.results.length).toBe(1)
      expect(result.current.data?.results[0].lastName).toBe("Two")
    })
  })

  describe("useGetClinicAdminQuery", () => {
    it("should return a clinic admin by id", async () => {
      const { result } = renderHook(
        () => useGetClinicAdminQuery("admin-id-1"),
        { wrapper },
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true), {
        timeout: 5000,
      })

      expect(result.current.data).toEqual(mockClinicAdmin)
    })

    it("should handle not found clinic admin", async () => {
      const { result } = renderHook(
        () => useGetClinicAdminQuery("non-existent-id"),
        { wrapper },
      )

      await waitFor(
        () =>
          expect(
            result.current.isError || result.current.isFetching === false,
          ).toBe(true),
        { timeout: 5000 },
      )

      if (result.current.isError) {
        expect(result.current.error).toBeDefined()
      } else {
        expect(result.current.isError).toBe(true)
      }
    })
  })

  describe("useAddClinicAdminMutation", () => {
    it("should add a new clinic admin", async () => {
      const { result } = renderHook(() => useAddClinicAdminMutation(), {
        wrapper,
      })

      const newClinicAdmin = {
        firstName: "Admin",
        lastName: "Three",
        email: "admin.three@example.com",
        password: "password123",
      }

      act(() => {
        const [addClinicAdmin] = result.current
        addClinicAdmin(newClinicAdmin).catch(error => {
          console.error("Failed to add clinic admin", error)
        })
      })

      await waitFor(() => expect(result.current[1].isSuccess).toBe(true), {
        timeout: 5000,
      })

      expect(result.current[1].data).toEqual({
        id: "admin-id-3",
        firstName: "Admin",
        lastName: "Three",
        email: "admin.three@example.com",
      })
    })
  })

  describe("useUpdateClinicAdminMutation", () => {
    it("should update a clinic admin", async () => {
      const { result } = renderHook(() => useUpdateClinicAdminMutation(), {
        wrapper,
      })

      const updatedClinicAdmin = {
        id: "admin-id-1",
        clinicAdmin: {
          firstName: "Admin Updated",
          lastName: "One",
          email: "admin.one@example.com",
        },
      }

      act(() => {
        const [updateClinicAdmin] = result.current
        updateClinicAdmin(updatedClinicAdmin).catch(error => {
          console.error("Failed to update clinic admin", error)
        })
      })

      await waitFor(() => expect(result.current[1].isSuccess).toBe(true), {
        timeout: 5000,
      })

      expect(result.current[1].data).toEqual({
        id: "admin-id-1",
        firstName: "Admin Updated",
        lastName: "One",
        email: "admin.one@example.com",
      })
    })
  })

  describe("useDeleteClinicAdminMutation", () => {
    it("should delete a clinic admin", async () => {
      const { result } = renderHook(() => useDeleteClinicAdminMutation(), {
        wrapper,
      })

      act(() => {
        const [deleteClinicAdmin] = result.current
        deleteClinicAdmin("admin-id-1").catch(error => {
          console.error("Failed to delete clinic admin", error)
        })
      })

      await waitFor(() => expect(result.current[1].isSuccess).toBe(true), {
        timeout: 5000,
      })

      expect(result.current[1].data).toEqual(null)
    })
  })
})
