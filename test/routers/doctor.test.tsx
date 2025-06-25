import { describe, expect, it, vi } from "vitest"
import { DoctorRouter } from "../../src/routers/doctor"

// Mock the components used by the router
vi.mock("../features/doctor", () => {
  return {
    CreateAppointment: vi.fn(() => null),
    DetailAppointment: vi.fn(() => null),
    DetailPatient: vi.fn(() => null),
    ListAppointment: vi.fn(() => null),
    ListPatient: vi.fn(() => null),
    Profile: vi.fn(() => null),
  }
})

describe("DoctorRouter", () => {
  it("should be defined as an array", () => {
    expect(Array.isArray(DoctorRouter)).toBe(true)
  })

  it("should have the correct number of top-level routes", () => {
    expect(DoctorRouter).toHaveLength(3)
  })

  it("should have the correct route paths", () => {
    const paths = DoctorRouter.map(route => route.path)

    expect(paths).toContain("doctor/appointment-list")
    expect(paths).toContain("doctor/patient-list")
    expect(paths).toContain("doctor/profile")
  })

  it("should have nested routes for appointment-list", () => {
    const route = DoctorRouter.find(
      route => route.path === "doctor/appointment-list",
    )
    expect(route?.children).toBeDefined()
    expect(route?.children).toHaveLength(3)

    // Check that required child routes exist
    const hasIndexRoute = route?.children?.some(child => child.index === true)
    const hasDetailRoute = route?.children?.some(
      child => child.path === ":idAppointment",
    )
    const hasCreateRoute = route?.children?.some(
      child => child.path === "create",
    )

    expect(hasIndexRoute).toBe(true)
    expect(hasDetailRoute).toBe(true)
    expect(hasCreateRoute).toBe(true)
  })

  it("should have nested routes for patient-list", () => {
    const route = DoctorRouter.find(
      route => route.path === "doctor/patient-list",
    )
    expect(route?.children).toBeDefined()
    expect(route?.children).toHaveLength(2)

    // Check that required child routes exist
    const hasIndexRoute = route?.children?.some(child => child.index === true)
    const hasDetailRoute = route?.children?.some(
      child => child.path === ":idPatient",
    )

    expect(hasIndexRoute).toBe(true)
    expect(hasDetailRoute).toBe(true)
  })

  it("should have a profile route with element", () => {
    const route = DoctorRouter.find(route => route.path === "doctor/profile")
    expect(route).toBeDefined()
    expect(route?.element).toBeDefined()
  })
})
