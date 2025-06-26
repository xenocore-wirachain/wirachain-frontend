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
  medicalConsultationApi,
  useAddMedicalConsultationMutation,
  useGetAllMedicalConsultationOfClinicQuery,
  useGetAllMedicalConsultationOfPatientQuery,
  useGetAllMedicalConsultationPerDoctorAndClinicQuery,
} from "../../../src/redux/api/MedicalConsultationAPI"
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
const MEDICAL_CONSULTATION = BASE_PATH.medicalConsultation

// Mock data
const mockConsultations = {
  results: [
    {
      id: "consult-id-1",
      date: "2025-05-15T10:00:00Z",
      reason: "Annual checkup",
      doctor: {
        id: "doc-id-1",
        firstName: "John",
        lastName: "Smith",
      },
      clinic: {
        id: 1,
        name: "Heart Clinic",
      },
      patient: {
        id: "patient-id-1",
        firstName: "Alice",
        lastName: "Johnson",
      },
    },
    {
      id: "consult-id-2",
      date: "2025-06-20T14:30:00Z",
      reason: "Follow-up",
      doctor: {
        id: "doc-id-1",
        firstName: "John",
        lastName: "Smith",
      },
      clinic: {
        id: 1,
        name: "Heart Clinic",
      },
      patient: {
        id: "patient-id-1",
        firstName: "Alice",
        lastName: "Johnson",
      },
    },
  ],
  pageIndex: 1,
  pageSize: 10,
  totalCount: 2,
  totalPages: 1,
}

// Mock IDs
const mockDoctorId = "doc-id-1"
const mockClinicId = 1
const mockPatientId = "patient-id-1"
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
      [medicalConsultationApi.reducerPath]: medicalConsultationApi.reducer,
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
      getDefaultMiddleware().concat(medicalConsultationApi.middleware),
  })
}

// Wrapper for render hook
function wrapper({ children }: { children: React.ReactNode }) {
  const store = setupStore()
  return <Provider store={store}>{children}</Provider>
}

describe("MedicalConsultationAPI", () => {
  beforeEach(() => {
    server.use(
      // Get all consultations per doctor and clinic
      http.get(
        `${API_URL}${MEDICAL_CONSULTATION}/doctor/:idDoctor/clinic/:idClinic`,
        ({ request }) => {
          const url = new URL(request.url)
          const pageIndex = url.searchParams.get("pageIndex") ?? "1"
          const pageSize = url.searchParams.get("pageSize") ?? "10"
          const searchTerm = url.searchParams.get("searchTerm") ?? ""

          let results = [...mockConsultations.results]
          if (searchTerm) {
            results = results.filter(consultation =>
              consultation.reason
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
            )
          }

          return HttpResponse.json({
            ...mockConsultations,
            pageIndex: Number(pageIndex),
            pageSize: Number(pageSize),
            results,
          })
        },
      ),

      // Get all consultations of patient
      http.get(
        `${API_URL}${MEDICAL_CONSULTATION}/patient/:idPatient`,
        ({ request }) => {
          const url = new URL(request.url)
          const pageIndex = url.searchParams.get("pageIndex") ?? "1"
          const pageSize = url.searchParams.get("pageSize") ?? "10"
          const searchTerm = url.searchParams.get("searchTerm") ?? ""

          let results = [...mockConsultations.results]
          if (searchTerm) {
            results = results.filter(consultation =>
              consultation.reason
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
            )
          }

          return HttpResponse.json({
            ...mockConsultations,
            pageIndex: Number(pageIndex),
            pageSize: Number(pageSize),
            results,
          })
        },
      ),

      // Get all consultations of clinic
      http.get(
        `${API_URL}${MEDICAL_CONSULTATION}/clinic_administrator/:id`,
        ({ request }) => {
          const url = new URL(request.url)
          const pageIndex = url.searchParams.get("pageIndex") ?? "1"
          const pageSize = url.searchParams.get("pageSize") ?? "10"
          const searchTerm = url.searchParams.get("searchTerm") ?? ""

          let results = [...mockConsultations.results]
          if (searchTerm) {
            results = results.filter(consultation =>
              consultation.reason
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
            )
          }

          return HttpResponse.json({
            ...mockConsultations,
            pageIndex: Number(pageIndex),
            pageSize: Number(pageSize),
            results,
          })
        },
      ),

      // Add consultation - UPDATED URL TO MATCH THE ACTUAL IMPLEMENTATION
      http.post(
        `${API_URL}${MEDICAL_CONSULTATION}/patient/:idPatient/doctor/:idDoctor/clinic/:idClinic`,
        () => {
          return HttpResponse.json({
            id: "consult-id-3",
            date: "2025-06-25T15:30:00Z",
            reason: "New consultation",
            doctor: {
              id: mockDoctorId,
              firstName: "John",
              lastName: "Smith",
            },
            clinic: {
              id: mockClinicId,
              name: "Heart Clinic",
            },
            patient: {
              id: mockPatientId,
              firstName: "Alice",
              lastName: "Johnson",
            },
          })
        },
      ),
    )
  })

  describe("useGetAllMedicalConsultationPerDoctorAndClinicQuery", () => {
    it("should return all consultations for a doctor and clinic", async () => {
      const { result } = renderHook(
        () =>
          useGetAllMedicalConsultationPerDoctorAndClinicQuery({
            pagination: { page: 1, pageSize: 10, search: "" },
            idDoctor: mockDoctorId,
            idClinic: mockClinicId,
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

      expect(result.current.data).toEqual(mockConsultations)
    })

    it("should filter consultations by search term", async () => {
      const { result } = renderHook(
        () =>
          useGetAllMedicalConsultationPerDoctorAndClinicQuery({
            pagination: { page: 1, pageSize: 10, search: "follow" },
            idDoctor: mockDoctorId,
            idClinic: mockClinicId,
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
      expect(result.current.data?.results[0].reason).toBe("Follow-up")
    })
  })

  describe("useGetAllMedicalConsultationOfPatientQuery", () => {
    it("should return all consultations for a patient", async () => {
      const { result } = renderHook(
        () =>
          useGetAllMedicalConsultationOfPatientQuery({
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

      expect(result.current.data).toEqual(mockConsultations)
    })
  })

  describe("useGetAllMedicalConsultationOfClinicQuery", () => {
    it("should return all consultations for a clinic administrator", async () => {
      const { result } = renderHook(
        () =>
          useGetAllMedicalConsultationOfClinicQuery({
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

      expect(result.current.data).toEqual(mockConsultations)
    })
  })

  describe("useAddMedicalConsultationMutation", () => {
    it("should add a new consultation", async () => {
      const { result } = renderHook(() => useAddMedicalConsultationMutation(), {
        wrapper,
      })

      const newConsultation = {
        consultation: {
          date: "2025-06-25T15:30:00Z",
          reason: "New consultation",
          diagnosis: "Healthy",
          treatment: "None",
        },
        idPatient: mockPatientId,
        idDoctor: mockDoctorId,
        idClinic: mockClinicId,
      }

      act(() => {
        const [addConsultation] = result.current
        addConsultation(newConsultation).catch((error: unknown) => {
          console.error("Failed to add consultation", error)
        })
      })

      await waitFor(
        () => {
          expect(result.current[1].isSuccess).toBe(true)
        },
        {
          timeout: 10000, // Increased timeout
        },
      )

      expect(result.current[1].data).toEqual({
        id: "consult-id-3",
        date: "2025-06-25T15:30:00Z",
        reason: "New consultation",
        doctor: {
          id: mockDoctorId,
          firstName: "John",
          lastName: "Smith",
        },
        clinic: {
          id: mockClinicId,
          name: "Heart Clinic",
        },
        patient: {
          id: mockPatientId,
          firstName: "Alice",
          lastName: "Johnson",
        },
      })
    })
  })
})
