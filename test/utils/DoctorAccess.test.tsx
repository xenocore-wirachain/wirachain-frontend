import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { getDoctorDataFromStorage } from "../../src/utils/DoctorAccess"

// Define the type for our mock localStorage
type MockLocalStorage = {
  getItem: ReturnType<typeof vi.fn>
  setItem: ReturnType<typeof vi.fn>
  clear: ReturnType<typeof vi.fn>
  removeItem: ReturnType<typeof vi.fn>
  length: number
  key: ReturnType<typeof vi.fn>
}

// Mock the localStorage with proper typing
const mockLocalStorage: MockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  length: 0,
  key: vi.fn(),
}

describe("DoctorAccess", () => {
  let originalConsoleError: typeof console.error

  beforeEach(() => {
    originalConsoleError = console.error
    console.error = vi.fn()

    // Mock localStorage
    vi.stubGlobal("localStorage", mockLocalStorage)

    // Clear mock calls
    vi.clearAllMocks()
  })

  afterEach(() => {
    console.error = originalConsoleError
  })

  describe("getDoctorDataFromStorage", () => {
    it("should return null when localStorage does not have doctor data", () => {
      // Given no doctor data in localStorage
      mockLocalStorage.getItem.mockReturnValueOnce(null)

      // When retrieving doctor data
      const result = getDoctorDataFromStorage()

      // Then it should return null
      expect(result).toBeNull()
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(
        "wirachain_doctor_data",
      )
    })

    it("should return parsed doctor data when available in localStorage", () => {
      // Define the type that matches DoctorDetailedResponse
      type MockDoctorData = {
        id: string
        name: string
        speciality: string
      }

      // Given doctor data in localStorage
      const mockDoctorData: MockDoctorData = {
        id: "123",
        name: "Dr. Jane Doe",
        speciality: "Cardiology",
      }

      mockLocalStorage.getItem.mockReturnValueOnce(
        JSON.stringify(mockDoctorData),
      )

      // When retrieving doctor data
      const result = getDoctorDataFromStorage()

      // Then it should return the parsed data
      expect(result).toEqual(mockDoctorData)
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(
        "wirachain_doctor_data",
      )
    })

    it("should handle and log JSON parse errors", () => {
      // Given invalid JSON in localStorage
      mockLocalStorage.getItem.mockReturnValueOnce("invalid json")

      // When retrieving doctor data with invalid JSON
      const result = getDoctorDataFromStorage()

      // Then it should return null and log the error
      expect(result).toBeNull()
      expect(console.error).toHaveBeenCalled()
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(
        "wirachain_doctor_data",
      )
    })
  })
})
