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
  clinicPatientApi,
  useAddClinicPatientMutation,
  useGetAllClinicsPerPatientQuery,
  useRemoveClinicPatientMutation,
} from "../../../src/redux/api/ClinicPatientAPI"
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
const PATIENT_PATH = BASE_PATH.patient

// Mock data
const mockClinicsPerPatient = {
  results: [
    {
      id: 1,
      name: "Heart Clinic",
      address: "123 Main St",
      associationDate: "2025-01-15",
    },
    {
      id: 2,
      name: "Brain Clinic",
      address: "456 Elm St",
      associationDate: "2025-02-20",
    },
  ],
  pageIndex: 1,
  pageSize: 10,
  totalCount: 2,
  totalPages: 1,
}

// Mock patient and clinic IDs
const mockPatientId = "patient-id-1"
const mockClinicId = 1

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
      [clinicPatientApi.reducerPath]: clinicPatientApi.reducer,
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
      getDefaultMiddleware().concat(clinicPatientApi.middleware),
  })
}

// Wrapper for render hook
function wrapper({ children }: { children: React.ReactNode }) {
  const store = setupStore()
  return <Provider store={store}>{children}</Provider>
}

describe("ClinicPatientAPI", () => {
  beforeEach(() => {
    server.use(
      // Get all clinics per patient
      http.get(`${API_URL}${CLINIC_PATH}/patient/:idPatient`, ({ request }) => {
        const url = new URL(request.url)
        const pageIndex = url.searchParams.get("pageIndex") ?? "1"
        const pageSize = url.searchParams.get("pageSize") ?? "10"
        const searchTerm = url.searchParams.get("searchTerm") ?? ""

        let results = [...mockClinicsPerPatient.results]
        if (searchTerm) {
          results = results.filter(clinic =>
            clinic.name.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        }

        return HttpResponse.json({
          ...mockClinicsPerPatient,
          pageIndex: Number(pageIndex),
          pageSize: Number(pageSize),
          results,
        })
      }),

      // Add clinic patient association
      http.post(`${API_URL}${PATIENT_PATH}/:patientId/clinic/:clinicId`, () => {
        return HttpResponse.json({
          patientId: mockPatientId,
          clinicId: mockClinicId,
          associationDate: "2025-06-25",
        })
      }),

      // Remove clinic patient association
      http.delete(
        `${API_URL}${PATIENT_PATH}/:patientId/clinic/:clinicId`,
        () => {
          return HttpResponse.json(null)
        },
      ),
    )
  })

  describe("useGetAllClinicsPerPatientQuery", () => {
    it("should return all clinics for a patient", async () => {
      const { result } = renderHook(
        () =>
          useGetAllClinicsPerPatientQuery({
            pagination: { page: 1, pageSize: 10, search: "" },
            idPatient: mockPatientId,
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

      expect(result.current.data).toEqual(mockClinicsPerPatient)
    })

    it("should filter clinics by search term", async () => {
      const { result } = renderHook(
        () =>
          useGetAllClinicsPerPatientQuery({
            pagination: { page: 1, pageSize: 10, search: "heart" },
            idPatient: mockPatientId,
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

  describe("useAddClinicPatientMutation", () => {
    it("should add a clinic patient association", async () => {
      const { result } = renderHook(() => useAddClinicPatientMutation(), {
        wrapper,
      })

      const clinicPatient = {
        patientId: mockPatientId,
        clinicId: mockClinicId,
      }

      act(() => {
        const [addClinicPatient] = result.current
        addClinicPatient(clinicPatient).catch((error: unknown) => {
          console.error("Failed to add clinic patient association", error)
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
        patientId: mockPatientId,
        clinicId: mockClinicId,
        associationDate: "2025-06-25",
      })
    })
  })

  describe("useRemoveClinicPatientMutation", () => {
    it("should remove a clinic patient association", async () => {
      const { result } = renderHook(() => useRemoveClinicPatientMutation(), {
        wrapper,
      })

      const clinicPatient = {
        patientId: mockPatientId,
        clinicId: mockClinicId,
      }

      act(() => {
        const [removeClinicPatient] = result.current
        removeClinicPatient(clinicPatient).catch((error: unknown) => {
          console.error("Failed to remove clinic patient association", error)
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
