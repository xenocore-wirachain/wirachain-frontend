import { describe, expect, it, vi } from "vitest"
import { ClinicRouter } from "../../src/routers/clinic"

// Mock the components used by the router
vi.mock("../features/clinic", () => ({
  DetailAppointment: vi.fn(() => null),
  HistoryAppoinment: vi.fn(() => null),
  ListClinic: vi.fn(() => null),
  ListDoctor: vi.fn(() => null),
  Profile: vi.fn(() => null),
  Stadistics: vi.fn(() => null),
}))

describe("ClinicRouter", () => {
  it("should be defined as an array", () => {
    expect(Array.isArray(ClinicRouter)).toBe(true)
  })

  it("should have the correct number of top-level routes", () => {
    expect(ClinicRouter).toHaveLength(5)
  })

  it("should have the correct route paths", () => {
    const paths = ClinicRouter.map(route => route.path)

    expect(paths).toContain("clinic/clinic-list")
    expect(paths).toContain("clinic/doctor-list")
    expect(paths).toContain("clinic/history-appointment")
    expect(paths).toContain("clinic/stadistics")
    expect(paths).toContain("clinic/profile")
  })

  it("should have clinic-list route with element", () => {
    const route = ClinicRouter.find(
      route => route.path === "clinic/clinic-list",
    )
    expect(route).toBeDefined()
    expect(route?.element).toBeDefined()
  })

  it("should have doctor-list route with element", () => {
    const route = ClinicRouter.find(
      route => route.path === "clinic/doctor-list",
    )
    expect(route).toBeDefined()
    expect(route?.element).toBeDefined()
  })

  it("should have nested routes for history-appointment", () => {
    const route = ClinicRouter.find(
      route => route.path === "clinic/history-appointment",
    )
    expect(route?.children).toBeDefined()
    expect(route?.children?.length).toBeGreaterThan(0)

    // Check that required child routes exist
    const hasIndexRoute = route?.children?.some(child => child.index === true)
    const hasDetailRoute = route?.children?.some(
      child => child.path === ":idAppointment",
    )

    expect(hasIndexRoute).toBe(true)
    expect(hasDetailRoute).toBe(true)
  })

  it("should have stadistics route with element", () => {
    const route = ClinicRouter.find(route => route.path === "clinic/stadistics")
    expect(route).toBeDefined()
    expect(route?.element).toBeDefined()
  })

  it("should have profile route with element", () => {
    const route = ClinicRouter.find(route => route.path === "clinic/profile")
    expect(route).toBeDefined()
    expect(route?.element).toBeDefined()
  })
})
