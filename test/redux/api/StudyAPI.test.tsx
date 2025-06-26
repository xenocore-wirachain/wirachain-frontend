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
  studyApi,
  useAddStudyMutation,
  useDeleteStudyMutation,
  useGetAllStudiesQuery,
  useGetStudyQuery,
  useUpdateStudyMutation,
} from "../../../src/redux/api/StudyAPI"
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
const STUDY_PATH = BASE_PATH.study

// Mock data
const mockStudies = {
  results: [
    { id: 1, name: "Blood Test", description: "Complete blood count test" },
    { id: 2, name: "X-Ray", description: "Chest X-ray examination" },
  ],
  pageIndex: 1,
  pageSize: 10,
  totalCount: 2,
  totalPages: 1,
}

const mockStudy = {
  id: 1,
  name: "Blood Test",
  description: "Complete blood count test",
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
      [studyApi.reducerPath]: studyApi.reducer,
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
      getDefaultMiddleware().concat(studyApi.middleware),
  })
}

// Wrapper for render hook
function wrapper({ children }: { children: React.ReactNode }) {
  const store = setupStore()
  return <Provider store={store}>{children}</Provider>
}

describe("StudyAPI", () => {
  beforeEach(() => {
    server.use(
      // Get all studies
      http.get(`${API_URL}${STUDY_PATH}/page`, ({ request }) => {
        const url = new URL(request.url)
        const pageIndex = url.searchParams.get("pageIndex") ?? "1"
        const pageSize = url.searchParams.get("pageSize") ?? "10"
        const searchTerm = url.searchParams.get("searchTerm") ?? ""

        let results = [...mockStudies.results]
        if (searchTerm) {
          results = results.filter(study =>
            study.name.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        }

        return HttpResponse.json({
          ...mockStudies,
          pageIndex: Number(pageIndex),
          pageSize: Number(pageSize),
          results,
        })
      }),

      // Get single study
      http.get(`${API_URL}${STUDY_PATH}/:id`, ({ params }) => {
        const id = Number(params.id)
        if (id === 1) {
          return HttpResponse.json(mockStudy)
        }
        return new HttpResponse(null, { status: 404 })
      }),

      // Add study
      http.post(`${API_URL}${STUDY_PATH}`, async ({ request }) => {
        const body = await request.json()
        return HttpResponse.json({
          id: 3,
          name: body.name,
          description: body.description,
        })
      }),

      // Update study
      http.put(`${API_URL}${STUDY_PATH}/:id`, async ({ params, request }) => {
        const id = Number(params.id)
        const body = await request.json()
        return HttpResponse.json({
          id,
          name: body.name,
          description: body.description,
        })
      }),

      // Delete study
      http.delete(`${API_URL}${STUDY_PATH}/:id`, () => {
        return HttpResponse.json(null)
      }),
    )
  })

  describe("useGetAllStudiesQuery", () => {
    it("should return all studies", async () => {
      const { result } = renderHook(
        () => useGetAllStudiesQuery({ page: 1, pageSize: 10, search: "" }),
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

      expect(result.current.data).toEqual(mockStudies)
    })

    it("should filter studies by search term", async () => {
      const { result } = renderHook(
        () => useGetAllStudiesQuery({ page: 1, pageSize: 10, search: "blood" }),
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
      expect(result.current.data?.results[0].name).toBe("Blood Test")
    })
  })

  describe("useGetStudyQuery", () => {
    it("should return a study by id", async () => {
      const { result } = renderHook(() => useGetStudyQuery(1), { wrapper })

      await waitFor(
        () => {
          expect(result.current.isSuccess).toBe(true)
        },
        {
          timeout: 5000,
        },
      )

      expect(result.current.data).toEqual(mockStudy)
    })

    it("should handle not found study", async () => {
      const { result } = renderHook(() => useGetStudyQuery(999), { wrapper })

      await waitFor(
        () => {
          expect(result.current.isError || !result.current.isFetching).toBe(
            true,
          )
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

  describe("useAddStudyMutation", () => {
    it("should add a new study", async () => {
      const { result } = renderHook(() => useAddStudyMutation(), { wrapper })

      const newStudy = {
        name: "MRI",
        description: "Magnetic Resonance Imaging",
      }

      act(() => {
        const [addStudy] = result.current
        addStudy(newStudy).catch((error: unknown) => {
          console.error("Failed to add study", error)
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
        name: "MRI",
        description: "Magnetic Resonance Imaging",
      })
    })
  })

  describe("useUpdateStudyMutation", () => {
    it("should update a study", async () => {
      const { result } = renderHook(() => useUpdateStudyMutation(), { wrapper })

      const updatedStudy = {
        id: 1,
        study: {
          name: "Complete Blood Count",
          description: "Comprehensive blood cell test",
        },
      }

      act(() => {
        const [updateStudy] = result.current
        updateStudy(updatedStudy).catch((error: unknown) => {
          console.error("Failed to update study", error)
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
        name: "Complete Blood Count",
        description: "Comprehensive blood cell test",
      })
    })
  })

  describe("useDeleteStudyMutation", () => {
    it("should delete a study", async () => {
      const { result } = renderHook(() => useDeleteStudyMutation(), { wrapper })

      act(() => {
        const [deleteStudy] = result.current
        deleteStudy(1).catch((error: unknown) => {
          console.error("Failed to delete study", error)
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
