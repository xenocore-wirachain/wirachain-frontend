import { render } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import DoctorDataLoader from "../../src/components/DoctorDataLoader"
import * as UseAuth from "../../src/features/auth/hooks/UseAuth"
import * as DoctorAPI from "../../src/redux/api/DoctorAPI"

// Mock UseAuth hook
vi.mock("../../src/features/auth/hooks/UseAuth", () => ({
  useAuth: vi.fn(),
}))

// Mock DoctorAPI hook
vi.mock("../../src/redux/api/DoctorAPI", () => ({
  useGetDoctorQuery: vi.fn(),
}))

// Mock USER_TYPES
vi.mock("../../src/utils/StaticVariables", () => ({
  USER_TYPES: {
    ADMIN: "ADMIN",
    CLINIC: "CLINIC",
    DOCTOR: "DOCTOR",
    PATIENT: "PATIENT",
  },
}))

describe("DoctorDataLoader Component", () => {
  // Setup localStorage mock
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Setup localStorage mock
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    })

    // Spy on console.error
    vi.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test("should store doctor data in localStorage when user is a doctor and data is loaded successfully", () => {
    // Mock doctor data
    const mockDoctorData = {
      id: "123",
      firstName: "John",
      lastName: "Doe",
      clinics: [
        { id: 1, name: "Clinic A" },
        { id: 2, name: "Clinic B" },
      ],
    }

    // Mock useAuth to return doctor type
    vi.mocked(UseAuth.useAuth).mockReturnValue({
      userId: "123",
      userType: "DOCTOR",
    })

    // Mock useGetDoctorQuery to return success with data
    vi.mocked(DoctorAPI.useGetDoctorQuery).mockReturnValue({
      data: mockDoctorData,
      isSuccess: true,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as any)

    render(<DoctorDataLoader />)

    // Check if localStorage was called with the correct data
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "available_clinic",
      JSON.stringify(mockDoctorData.clinics),
    )
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "choosen_clinic",
      JSON.stringify(mockDoctorData.clinics[0].id),
    )
  })

  test("should not store doctor data when user is not a doctor", () => {
    // Mock useAuth to return admin type
    vi.mocked(UseAuth.useAuth).mockReturnValue({
      userId: "123",
      userType: "ADMIN",
    })

    // Mock useGetDoctorQuery to be skipped
    vi.mocked(DoctorAPI.useGetDoctorQuery).mockReturnValue({
      data: undefined,
      isSuccess: false,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as any)

    render(<DoctorDataLoader />)

    // Check localStorage was not called
    expect(localStorageMock.setItem).not.toHaveBeenCalled()
  })

  test("should handle localStorage errors gracefully", () => {
    // Mock doctor data
    const mockDoctorData = {
      id: "123",
      firstName: "John",
      lastName: "Doe",
      clinics: [
        { id: 1, name: "Clinic A" },
        { id: 2, name: "Clinic B" },
      ],
    }

    // Mock useAuth to return doctor type
    vi.mocked(UseAuth.useAuth).mockReturnValue({
      userId: "123",
      userType: "DOCTOR",
    })

    // Mock useGetDoctorQuery to return success with data
    vi.mocked(DoctorAPI.useGetDoctorQuery).mockReturnValue({
      data: mockDoctorData,
      isSuccess: true,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as any)

    // Make localStorage.setItem throw an error
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error("localStorage error")
    })

    render(<DoctorDataLoader />)

    // Check if error was logged
    expect(console.error).toHaveBeenCalledWith(
      "Error storing doctor data in localStorage",
      expect.any(Error),
    )
  })

  test("should throw error when userId is not provided", () => {
    // Mock useAuth to return undefined userId
    vi.mocked(UseAuth.useAuth).mockReturnValue({
      userId: undefined,
      userType: "DOCTOR",
    })

    expect(() => render(<DoctorDataLoader />)).toThrow(
      "User ID is required for clinic admin operations",
    )
  })
})
