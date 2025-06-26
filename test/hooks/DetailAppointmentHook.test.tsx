import type { UUID } from "crypto"
import { describe, expect, test, vi } from "vitest"
import { useDetailAppointmentHook } from "../../src/hooks/DetailAppointmentHook"
import * as Redux from "../../src/redux"

// Mock Redux hooks and queries
vi.mock("../../src/redux", () => ({
  useGetMedicalConsultationQuery: vi.fn(),
}))

describe("DetailAppointmentHook", () => {
  test("should return appointment data from query result", () => {
    // Mock data that the query would return
    const mockAppointmentData = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      checkInDateTime: "2023-05-10T14:30:00",
      durationTimeSpan: "1 hour",
      notes: "Regular checkup",
      doctorInCharge: {
        firstName: "John",
        lastName: "Doe",
        gender: "Male",
      },
      patient: {
        firstName: "Jane",
        lastName: "Smith",
        gender: "Female",
        dateOfBirth: "1990-01-15",
      },
      clinic: {
        name: "City Hospital",
        address: "123 Main St",
        ruc: "12345678901",
      },
    }

    // Setup the mock to return our data
    vi.mocked(Redux.useGetMedicalConsultationQuery).mockReturnValue({
      data: mockAppointmentData,
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    } as any)

    const testId = "123e4567-e89b-12d3-a456-426614174000" as UUID
    const hook = useDetailAppointmentHook(testId)

    // Verify the hook returns the expected data
    expect(Redux.useGetMedicalConsultationQuery).toHaveBeenCalledWith(testId)
    expect(hook.AppoimentData).toEqual(mockAppointmentData)
  })

  test("should handle case when query returns no data", () => {
    // Setup the mock to return undefined data (loading or error state)
    vi.mocked(Redux.useGetMedicalConsultationQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
      refetch: vi.fn(),
    } as any)

    const testId = "123e4567-e89b-12d3-a456-426614174000" as UUID
    const hook = useDetailAppointmentHook(testId)

    // Verify the hook returns undefined for the appointment data
    expect(Redux.useGetMedicalConsultationQuery).toHaveBeenCalledWith(testId)
    expect(hook.AppoimentData).toBeUndefined()
  })
})
