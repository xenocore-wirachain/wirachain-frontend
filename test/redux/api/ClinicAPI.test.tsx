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
  clinicApi,
  useAddClinicMutation,
  useDeleteClinicMutation,
  useGetAllClinicsQuery,
  useGetClinicQuery,
  useUpdateClinicMutation,
} from "../../../src/redux/api/ClinicAPI"
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
const CLINIC_PATH = BASE_PATH.clinic

// Mock data
const mockClinics = {
  results: [
    {
      id: 1,
      name: "Heart Clinic",
      address: "123 Main St",
      clinicAdminId: "admin-id-1",
    },
    {
      id: 2,
      name: "Brain Clinic",
      address: "456 Elm St",
      clinicAdminId: "admin-id-1",
    },
  ],
  pageIndex: 1,
  pageSize: 10,
  totalCount: 2,
  totalPages: 1,
}

const mockClinic = {
  id: 1,
  name: "Heart Clinic",
  address: "123 Main St",
  clinicAdminId: "admin-id-1",
}
const mockClinicAdminId = "admin-id-1"

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
      [clinicApi.reducerPath]: clinicApi.reducer,
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
      getDefaultMiddleware().concat(clinicApi.middleware),
  })
}

// Wrapper for render hook
function wrapper({ children }: { children: React.ReactNode }) {
  const store = setupStore()
  return <Provider store={store}>{children}</Provider>
}

describe("ClinicAPI", () => {
  beforeEach(() => {
    server.use(
      // Get all clinics for admin
      http.get(`${API_URL}${CLINIC_PATH}/page/admin/:id`, ({ request }) => {
        const url = new URL(request.url)
        const pageIndex = url.searchParams.get("pageIndex") ?? "1"
        const pageSize = url.searchParams.get("pageSize") ?? "10"
        const searchTerm = url.searchParams.get("searchTerm") ?? ""

        let results = [...mockClinics.results]
        if (searchTerm) {
          results = results.filter(clinic =>
            clinic.name.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        }

        return HttpResponse.json({
          ...mockClinics,
          pageIndex: Number(pageIndex),
          pageSize: Number(pageSize),
          results,
        })
      }),

      // Get single clinic
      http.get(`${API_URL}${CLINIC_PATH}/:id/`, ({ params }) => {
        const id = Number(params.id)
        if (id === 1) {
          return HttpResponse.json(mockClinic)
        }
        return new HttpResponse(null, { status: 404 })
      }),

      // Add clinic
      http.post(`${API_URL}${CLINIC_PATH}`, async ({ request }) => {
        const body = await request.json()
        return HttpResponse.json({
          id: 3,
          name: body.name,
          address: body.address,
          clinicAdminId: body.clinicAdminId,
        })
      }),

      // Update clinic
      http.put(`${API_URL}${CLINIC_PATH}/:id/`, async ({ params, request }) => {
        const id = Number(params.id)
        const body = await request.json()
        return HttpResponse.json({
          id,
          name: body.name,
          address: body.address,
          clinicAdminId: body.clinicAdminId,
        })
      }),

      // Delete clinic
      http.delete(`${API_URL}${CLINIC_PATH}/:id/`, () => {
        return HttpResponse.json(null)
      }),
    )
  })

  describe("useGetAllClinicsQuery", () => {
    it("should return all clinics for admin", async () => {
      const { result } = renderHook(
        () =>
          useGetAllClinicsQuery({
            pagination: { page: 1, pageSize: 10, search: "" },
            id: mockClinicAdminId,
          }),
        { wrapper },
      )

      await waitFor(
        () => {
          expect(result.current.isSuccess).toBe(true)
        },
        {
          timeout: 5000,
        },
      )

      expect(result.current.data).toEqual(mockClinics)
    })

    it("should filter clinics by search term", async () => {
      const { result } = renderHook(
        () =>
          useGetAllClinicsQuery({
            pagination: { page: 1, pageSize: 10, search: "heart" },
            id: mockClinicAdminId,
          }),
        { wrapper },
      )

      await waitFor(
        () => {
          expect(result.current.isSuccess).toBe(true)
        },
        {
          timeout: 5000,
        },
      )

      expect(result.current.data?.results.length).toBe(1)
      expect(result.current.data?.results[0].name).toBe("Heart Clinic")
    })
  })

  describe("useGetClinicQuery", () => {
    it("should return a clinic by id", async () => {
      const { result } = renderHook(() => useGetClinicQuery(1), { wrapper })

      await waitFor(
        () => {
          expect(result.current.isSuccess).toBe(true)
        },
        {
          timeout: 5000,
        },
      )

      expect(result.current.data).toEqual(mockClinic)
    })

    it("should handle not found clinic", async () => {
      const { result } = renderHook(() => useGetClinicQuery(999), { wrapper })

      await waitFor(
        () => {
          expect(
            result.current.isError || result.current.isFetching === false,
          ).toBe(true)
        },
        { timeout: 5000 },
      )

      if (result.current.isError) {
        expect(result.current.error).toBeDefined()
      } else {
        expect(result.current.isError).toBe(true)
      }
    })
  })

  describe("useAddClinicMutation", () => {
    it("should add a new clinic", async () => {
      const { result } = renderHook(() => useAddClinicMutation(), { wrapper })

      const newClinic = {
        name: "New Clinic",
        address: "789 Oak St",
        clinicAdminId: mockClinicAdminId,
      }

      act(() => {
        const [addClinic] = result.current
        addClinic(newClinic).catch((error: unknown) => {
          console.error("Failed to add clinic", error)
        })
      })

      await waitFor(
        () => {
          expect(result.current[1].isSuccess).toBe(true)
        },
        {
          timeout: 5000,
        },
      )

      expect(result.current[1].data).toEqual({
        id: 3,
        name: "New Clinic",
        address: "789 Oak St",
        clinicAdminId: mockClinicAdminId,
      })
    })
  })

  describe("useUpdateClinicMutation", () => {
    it("should update a clinic", async () => {
      const { result } = renderHook(() => useUpdateClinicMutation(), {
        wrapper,
      })

      const updatedClinic = {
        id: 1,
        clinic: {
          name: "Updated Heart Clinic",
          address: "123 Main St Updated",
          clinicAdminId: mockClinicAdminId,
        },
      }

      act(() => {
        const [updateClinic] = result.current
        updateClinic(updatedClinic).catch((error: unknown) => {
          console.error("Failed to update clinic", error)
        })
      })

      await waitFor(
        () => {
          expect(result.current[1].isSuccess).toBe(true)
        },
        {
          timeout: 5000,
        },
      )

      expect(result.current[1].data).toEqual({
        id: 1,
        name: "Updated Heart Clinic",
        address: "123 Main St Updated",
        clinicAdminId: mockClinicAdminId,
      })
    })
  })

  describe("useDeleteClinicMutation", () => {
    it("should delete a clinic", async () => {
      const { result } = renderHook(() => useDeleteClinicMutation(), {
        wrapper,
      })

      act(() => {
        const [deleteClinic] = result.current
        deleteClinic(1).catch((error: unknown) => {
          console.error("Failed to delete clinic", error)
        })
      })

      await waitFor(
        () => {
          expect(result.current[1].isSuccess).toBe(true)
        },
        {
          timeout: 5000,
        },
      )

      expect(result.current[1].data).toEqual(null)
    })
  })
})
