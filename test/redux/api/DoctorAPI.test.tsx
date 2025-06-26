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
  doctorApi,
  useAddDoctorMutation,
  useDeleteDoctorMutation,
  useGetAllDoctorsQuery,
  useGetDoctorQuery,
  useUpdateDoctorMutation,
} from "../../../src/redux/api/DoctorAPI"
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
const DOCTOR_PATH = BASE_PATH.doctor

// Mock data
const mockDoctors = {
  results: [
    {
      id: "doc-id-1",
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@example.com",
      specialityId: 1,
      clinicId: 1,
      speciality: { id: 1, name: "Cardiology" },
      clinic: { id: 1, name: "Heart Clinic" },
    },
    {
      id: "doc-id-2",
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
      specialityId: 2,
      clinicId: 1,
      speciality: { id: 2, name: "Neurology" },
      clinic: { id: 1, name: "Heart Clinic" },
    },
  ],
  pageIndex: 1,
  pageSize: 10,
  totalCount: 2,
  totalPages: 1,
}

const mockDoctor = {
  id: "doc-id-1",
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@example.com",
  specialityId: 1,
  clinicId: 1,
  speciality: { id: 1, name: "Cardiology" },
  clinic: { id: 1, name: "Heart Clinic" },
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
      [doctorApi.reducerPath]: doctorApi.reducer,
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
      getDefaultMiddleware().concat(doctorApi.middleware),
  })
}

// Wrapper for render hook
function wrapper({ children }: { children: React.ReactNode }) {
  const store = setupStore()
  return <Provider store={store}>{children}</Provider>
}

describe("DoctorAPI", () => {
  beforeEach(() => {
    server.use(
      // Get all doctors for admin
      http.get(`${API_URL}${DOCTOR_PATH}/page/admin/:id`, ({ request }) => {
        const url = new URL(request.url)
        const pageIndex = url.searchParams.get("pageIndex") ?? "1"
        const pageSize = url.searchParams.get("pageSize") ?? "10"
        const searchTerm = url.searchParams.get("searchTerm") ?? ""

        let results = [...mockDoctors.results]
        if (searchTerm) {
          results = results.filter(
            doctor =>
              `${doctor.firstName} ${doctor.lastName}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              doctor.email.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        }

        return HttpResponse.json({
          ...mockDoctors,
          pageIndex: Number(pageIndex),
          pageSize: Number(pageSize),
          results,
        })
      }),

      // Get single doctor
      http.get(`${API_URL}${DOCTOR_PATH}/:id`, ({ params }) => {
        const id = params.id
        if (id === "doc-id-1") {
          return HttpResponse.json(mockDoctor)
        }
        return new HttpResponse(null, { status: 404 })
      }),

      // Add doctor
      http.post(`${API_URL}${DOCTOR_PATH}`, async ({ request }) => {
        const body = await request.json()
        const response = {
          id: "doc-id-3",
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          specialityId: body.specialityId,
          clinicId: body.clinicId,
        }
        return HttpResponse.json(response)
      }),

      // Update doctor
      http.put(`${API_URL}${DOCTOR_PATH}/:id`, async ({ params, request }) => {
        const id = params.id
        const body = await request.json()
        const response = {
          id,
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          specialityId: body.specialityId,
          clinicId: body.clinicId,
        }
        return HttpResponse.json(response)
      }),

      // Delete doctor
      http.delete(`${API_URL}${DOCTOR_PATH}/:id`, () => {
        return HttpResponse.json(null)
      }),
    )
  })

  describe("useGetAllDoctorsQuery", () => {
    it("should return all doctors for admin", async () => {
      const { result } = renderHook(
        () =>
          useGetAllDoctorsQuery({
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

      expect(result.current.data).toEqual(mockDoctors)
    })

    it("should filter doctors by search term", async () => {
      const { result } = renderHook(
        () =>
          useGetAllDoctorsQuery({
            pagination: { page: 1, pageSize: 10, search: "john" },
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
      expect(result.current.data?.results[0].firstName).toBe("John")
    })
  })

  describe("useGetDoctorQuery", () => {
    it("should return a doctor by id", async () => {
      const { result } = renderHook(() => useGetDoctorQuery("doc-id-1"), {
        wrapper,
      })

      await waitFor(
        () => {
          expect(result.current.isSuccess).toBe(true)
        },
        {
          timeout: 5000,
        },
      )

      expect(result.current.data).toEqual(mockDoctor)
    })

    it("should handle not found doctor", async () => {
      const { result } = renderHook(
        () => useGetDoctorQuery("non-existent-id"),
        { wrapper },
      )

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

  describe("useAddDoctorMutation", () => {
    it("should add a new doctor", async () => {
      const { result } = renderHook(() => useAddDoctorMutation(), { wrapper })

      const newDoctor = {
        firstName: "Robert",
        lastName: "Johnson",
        email: "robert.johnson@example.com",
        specialityId: 3,
        clinicId: 2,
        password: "password123",
      }

      act(() => {
        const [addDoctor] = result.current
        addDoctor(newDoctor).catch((error: unknown) => {
          console.error("Failed to add doctor", error)
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
        id: "doc-id-3",
        firstName: "Robert",
        lastName: "Johnson",
        email: "robert.johnson@example.com",
        specialityId: 3,
        clinicId: 2,
      })
    })
  })

  describe("useUpdateDoctorMutation", () => {
    it("should update a doctor", async () => {
      const { result } = renderHook(() => useUpdateDoctorMutation(), {
        wrapper,
      })

      const updatedDoctor = {
        id: "doc-id-1",
        doctor: {
          firstName: "John Updated",
          lastName: "Smith",
          email: "john.smith@example.com",
          specialityId: 1,
          clinicId: 1,
        },
      }

      act(() => {
        const [updateDoctor] = result.current
        updateDoctor(updatedDoctor).catch((error: unknown) => {
          console.error("Failed to update doctor", error)
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
        id: "doc-id-1",
        firstName: "John Updated",
        lastName: "Smith",
        email: "john.smith@example.com",
        specialityId: 1,
        clinicId: 1,
      })
    })
  })

  describe("useDeleteDoctorMutation", () => {
    it("should delete a doctor", async () => {
      const { result } = renderHook(() => useDeleteDoctorMutation(), {
        wrapper,
      })

      act(() => {
        const [deleteDoctor] = result.current
        deleteDoctor("doc-id-1").catch((error: unknown) => {
          console.error("Failed to delete doctor", error)
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
