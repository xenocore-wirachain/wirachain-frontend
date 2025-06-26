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
  patientApi,
  useAddPatientMutation,
  useGetPatientQuery,
  useGetPatientsPerClinicQuery,
  useUpdatePatientMutation,
} from "../../../src/redux/api/PatientAPI"
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
const PATIENT_PATH = BASE_PATH.patient

// Mock data
const mockPatients = {
  results: [
    {
      id: "patient-id-1",
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice.johnson@example.com",
      dateOfBirth: "1990-05-15",
      gender: "FEMALE",
      phoneNumber: "555-123-4567",
    },
    {
      id: "patient-id-2",
      firstName: "Bob",
      lastName: "Smith",
      email: "bob.smith@example.com",
      dateOfBirth: "1985-10-20",
      gender: "MALE",
      phoneNumber: "555-987-6543",
    },
  ],
  pageIndex: 1,
  pageSize: 10,
  totalCount: 2,
  totalPages: 1,
}

const mockPatient = {
  id: "patient-id-1",
  firstName: "Alice",
  lastName: "Johnson",
  email: "alice.johnson@example.com",
  dateOfBirth: "1990-05-15",
  gender: "FEMALE",
  phoneNumber: "555-123-4567",
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
      [patientApi.reducerPath]: patientApi.reducer,
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
      getDefaultMiddleware().concat(patientApi.middleware),
  })
}

// Wrapper for render hook
function wrapper({ children }: { children: React.ReactNode }) {
  const store = setupStore()
  return <Provider store={store}>{children}</Provider>
}

describe("PatientAPI", () => {
  beforeEach(() => {
    server.use(
      // Get patients per clinic
      http.get(`${API_URL}${PATIENT_PATH}/clinic/:idClinic`, ({ request }) => {
        const url = new URL(request.url)
        const pageIndex = url.searchParams.get("pageIndex") ?? "1"
        const pageSize = url.searchParams.get("pageSize") ?? "10"
        const searchTerm = url.searchParams.get("searchTerm") ?? ""

        let results = [...mockPatients.results]
        if (searchTerm) {
          results = results.filter(
            patient =>
              `${patient.firstName} ${patient.lastName}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              patient.email.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        }

        return HttpResponse.json({
          ...mockPatients,
          pageIndex: Number(pageIndex),
          pageSize: Number(pageSize),
          results,
        })
      }),

      // Get single patient
      http.get(`${API_URL}${PATIENT_PATH}/:id`, ({ params }) => {
        const id = params.id
        if (id === "patient-id-1") {
          return HttpResponse.json(mockPatient)
        }
        return new HttpResponse(null, { status: 404 })
      }),

      // Add patient
      http.post(`${API_URL}${PATIENT_PATH}`, async ({ request }) => {
        const body = await request.json()
        const response = {
          id: "patient-id-3",
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          dateOfBirth: body.dateOfBirth,
          gender: body.gender,
          phoneNumber: body.phoneNumber,
        }
        return HttpResponse.json(response)
      }),

      // Update patient
      http.put(`${API_URL}${PATIENT_PATH}/:id`, async ({ params, request }) => {
        const id = params.id
        const body = await request.json()
        const response = {
          id,
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          dateOfBirth: body.dateOfBirth,
          gender: body.gender,
          phoneNumber: body.phoneNumber,
        }
        return HttpResponse.json(response)
      }),
    )
  })

  describe("useGetPatientsPerClinicQuery", () => {
    it("should return all patients for a clinic", async () => {
      const { result } = renderHook(
        () =>
          useGetPatientsPerClinicQuery({
            pagination: { page: 1, pageSize: 10, search: "" },
            idClinic: 1,
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

      expect(result.current.data).toEqual(mockPatients)
    })

    it("should filter patients by search term", async () => {
      const { result } = renderHook(
        () =>
          useGetPatientsPerClinicQuery({
            pagination: { page: 1, pageSize: 10, search: "alice" },
            idClinic: 1,
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
      expect(result.current.data?.results[0].firstName).toBe("Alice")
    })
  })

  describe("useGetPatientQuery", () => {
    it("should return a patient by id", async () => {
      const { result } = renderHook(() => useGetPatientQuery("patient-id-1"), {
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

      expect(result.current.data).toEqual(mockPatient)
    })

    it("should handle not found patient", async () => {
      const { result } = renderHook(
        () => useGetPatientQuery("non-existent-id"),
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

  describe("useAddPatientMutation", () => {
    it("should add a new patient", async () => {
      const { result } = renderHook(() => useAddPatientMutation(), { wrapper })

      const newPatient = {
        firstName: "Charlie",
        lastName: "Brown",
        email: "charlie.brown@example.com",
        dateOfBirth: "1995-08-10",
        gender: "MALE",
        phoneNumber: "555-111-2222",
        password: "password123",
      }

      act(() => {
        const [addPatient] = result.current
        addPatient(newPatient).catch((error: unknown) => {
          console.error("Failed to add patient", error)
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
        id: "patient-id-3",
        firstName: "Charlie",
        lastName: "Brown",
        email: "charlie.brown@example.com",
        dateOfBirth: "1995-08-10",
        gender: "MALE",
        phoneNumber: "555-111-2222",
      })
    })
  })

  describe("useUpdatePatientMutation", () => {
    it("should update a patient", async () => {
      const { result } = renderHook(() => useUpdatePatientMutation(), {
        wrapper,
      })

      const updatedPatient = {
        id: "patient-id-1",
        patient: {
          firstName: "Alice Updated",
          lastName: "Johnson",
          email: "alice.johnson@example.com",
          dateOfBirth: "1990-05-15",
          gender: "FEMALE",
          phoneNumber: "555-123-4567",
        },
      }

      act(() => {
        const [updatePatient] = result.current
        updatePatient(updatedPatient).catch((error: unknown) => {
          console.error("Failed to update patient", error)
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
        id: "patient-id-1",
        firstName: "Alice Updated",
        lastName: "Johnson",
        email: "alice.johnson@example.com",
        dateOfBirth: "1990-05-15",
        gender: "FEMALE",
        phoneNumber: "555-123-4567",
      })
    })
  })
})
