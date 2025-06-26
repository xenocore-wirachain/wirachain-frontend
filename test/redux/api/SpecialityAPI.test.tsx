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
  specialityApi,
  useAddSpecialityMutation,
  useDeleteSpecialityMutation,
  useGetAllSpecialitiesQuery,
  useGetSpecialityQuery,
  useUpdateSpecialityMutation,
} from "../../../src/redux/api/SpecialityAPI"
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
const SPECIALITY_PATH = BASE_PATH.speciality

// Mock data
const mockSpecialities = {
  results: [
    {
      id: 1,
      name: "Cardiology",
      description: "Heart related medical practice",
    },
    { id: 2, name: "Neurology", description: "Brain related medical practice" },
  ],
  pageIndex: 1,
  pageSize: 10,
  totalCount: 2,
  totalPages: 1,
}

const mockSpeciality = {
  id: 1,
  name: "Cardiology",
  description: "Heart related medical practice",
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
      [specialityApi.reducerPath]: specialityApi.reducer,
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
      getDefaultMiddleware().concat(specialityApi.middleware),
  })
}

// Wrapper for render hook
function wrapper({ children }: { children: React.ReactNode }) {
  const store = setupStore()
  return <Provider store={store}>{children}</Provider>
}

describe("SpecialityAPI", () => {
  beforeEach(() => {
    server.use(
      // Get all specialities
      http.get(`${API_URL}${SPECIALITY_PATH}/page`, ({ request }) => {
        const url = new URL(request.url)
        const pageIndex = url.searchParams.get("pageIndex") ?? "1"
        const pageSize = url.searchParams.get("pageSize") ?? "10"
        const searchTerm = url.searchParams.get("searchTerm") ?? ""

        let results = [...mockSpecialities.results]
        if (searchTerm) {
          results = results.filter(spec =>
            spec.name.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        }

        return HttpResponse.json({
          ...mockSpecialities,
          pageIndex: Number(pageIndex),
          pageSize: Number(pageSize),
          results,
        })
      }),

      // Get single speciality
      http.get(`${API_URL}${SPECIALITY_PATH}/:id`, ({ params }) => {
        const id = Number(params.id)
        if (id === 1) {
          return HttpResponse.json(mockSpeciality)
        }
        return new HttpResponse(null, { status: 404 })
      }),

      // Add speciality
      http.post(`${API_URL}${SPECIALITY_PATH}`, async ({ request }) => {
        const body = await request.json()
        return HttpResponse.json({
          id: 3,
          name: body.name,
          description: body.description,
        })
      }),

      // Update speciality
      http.put(
        `${API_URL}${SPECIALITY_PATH}/:id`,
        async ({ params, request }) => {
          const id = Number(params.id)
          const body = await request.json()
          return HttpResponse.json({
            id,
            name: body.name,
            description: body.description,
          })
        },
      ),

      // Delete speciality
      http.delete(`${API_URL}${SPECIALITY_PATH}/:id`, () => {
        return HttpResponse.json(null)
      }),
    )
  })

  describe("useGetAllSpecialitiesQuery", () => {
    it("should return all specialities", async () => {
      const { result } = renderHook(
        () => useGetAllSpecialitiesQuery({ page: 1, pageSize: 10, search: "" }),
        { wrapper },
      )

      // Use waitFor instead of manual timeout
      await waitFor(
        () => {
          expect(result.current.isSuccess).toBe(true)
        },
        {
          timeout: 5000,
        },
      )

      // Now that isSuccess is true, we can check the data
      expect(result.current.data).toEqual(mockSpecialities)
    })

    it("should filter specialities by search term", async () => {
      const { result } = renderHook(
        () =>
          useGetAllSpecialitiesQuery({ page: 1, pageSize: 10, search: "card" }),
        { wrapper },
      )

      // Use waitFor instead of manual timeout
      await waitFor(
        () => {
          expect(result.current.isSuccess).toBe(true)
        },
        {
          timeout: 5000,
        },
      )

      // Now that isSuccess is true, we can check the data
      expect(result.current.data?.results.length).toBe(1)
      expect(result.current.data?.results[0].name).toBe("Cardiology")
    })
  })

  describe("useGetSpecialityQuery", () => {
    it("should return a speciality by id", async () => {
      const { result } = renderHook(() => useGetSpecialityQuery(1), { wrapper })

      // Use waitFor instead of manual timeout
      await waitFor(
        () => {
          expect(result.current.isSuccess).toBe(true)
        },
        {
          timeout: 5000,
        },
      )

      // Now that isSuccess is true, we can check the data
      expect(result.current.data).toEqual(mockSpeciality)
    })

    it("should handle not found speciality", async () => {
      const { result } = renderHook(() => useGetSpecialityQuery(999), {
        wrapper,
      })

      // Use waitFor instead of manual timeout
      await waitFor(
        () => {
          expect(result.current.isError || !result.current.isFetching).toBe(
            true,
          )
        },
        { timeout: 5000 },
      )

      // Check if we got an error
      if (result.current.isError) {
        expect(result.current.error).toBeDefined()
      } else {
        // If not an error but done fetching, the test should fail
        expect(result.current.isError).toBe(true)
      }
    })
  })

  describe("useAddSpecialityMutation", () => {
    it("should add a new speciality", async () => {
      const { result } = renderHook(() => useAddSpecialityMutation(), {
        wrapper,
      })

      const newSpeciality = {
        name: "Orthopedics",
        description: "Bone related medical practice",
      }

      // Execute the mutation
      act(() => {
        const [addSpeciality] = result.current
        addSpeciality(newSpeciality).catch(error => {
          console.error("Failed to add speciality", error)
        })
      })

      // Wait for the mutation to complete
      await waitFor(
        () => {
          expect(result.current[1].isSuccess).toBe(true)
        },
        {
          timeout: 5000,
        },
      )

      // Check the result
      expect(result.current[1].data).toEqual({
        id: 3,
        name: "Orthopedics",
        description: "Bone related medical practice",
      })
    })
  })

  describe("useUpdateSpecialityMutation", () => {
    it("should update a speciality", async () => {
      const { result } = renderHook(() => useUpdateSpecialityMutation(), {
        wrapper,
      })

      const updatedSpeciality = {
        id: 1,
        speciality: {
          name: "Cardiology Updated",
          description: "Updated heart related medical practice",
        },
      }

      // Execute the mutation
      act(() => {
        const [updateSpeciality] = result.current
        updateSpeciality(updatedSpeciality).catch(error => {
          console.error("Failed to update speciality", error)
        })
      })

      // Wait for the mutation to complete
      await waitFor(
        () => {
          expect(result.current[1].isSuccess).toBe(true)
        },
        {
          timeout: 5000,
        },
      )

      // Check the result
      expect(result.current[1].data).toEqual({
        id: 1,
        name: "Cardiology Updated",
        description: "Updated heart related medical practice",
      })
    })
  })

  describe("useDeleteSpecialityMutation", () => {
    it("should delete a speciality", async () => {
      const { result } = renderHook(() => useDeleteSpecialityMutation(), {
        wrapper,
      })

      // Execute the mutation
      act(() => {
        const [deleteSpeciality] = result.current
        deleteSpeciality(1).catch(error => {
          console.error("Failed to delete speciality", error)
        })
      })

      // Wait for the mutation to complete
      await waitFor(
        () => {
          expect(result.current[1].isSuccess).toBe(true)
        },
        {
          timeout: 5000,
        },
      )

      // Check the result
      expect(result.current[1].data).toEqual(null)
    })
  })
})
