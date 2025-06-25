import { describe, expect, it, vi } from "vitest"
import { AdminRouter } from "../../src/routers/admin"

// Mock the components used by the router
vi.mock("../../features/admin", () => ({
  ListClinicAdmin: vi.fn(() => null),
  ListSpecialty: vi.fn(() => null),
  ListStudy: vi.fn(() => null),
  Profile: vi.fn(() => null),
}))

describe("AdminRouter", () => {
  it("should be defined as an array", () => {
    expect(Array.isArray(AdminRouter)).toBe(true)
  })

  it("should have the correct number of routes", () => {
    expect(AdminRouter).toHaveLength(4)
  })

  it("should have the correct route paths", () => {
    const paths = AdminRouter.map(route => route.path)

    expect(paths).toContain("admin/clinic-admin-list")
    expect(paths).toContain("admin/speciality-list")
    expect(paths).toContain("admin/study-list")
    expect(paths).toContain("admin/profile")
  })

  it("should map clinic-admin-list to ListClinicAdmin component", () => {
    const route = AdminRouter.find(
      route => route.path === "admin/clinic-admin-list",
    )
    expect(route?.element).toBeTruthy()
    expect(route?.element).toHaveProperty("type.name", "ListClinicAdmin")
  })

  it("should map speciality-list to ListSpecialty component", () => {
    const route = AdminRouter.find(
      route => route.path === "admin/speciality-list",
    )
    expect(route?.element).toBeTruthy()
    expect(route?.element).toHaveProperty("type.name", "ListSpecialty")
  })

  it("should map study-list to ListStudy component", () => {
    const route = AdminRouter.find(route => route.path === "admin/study-list")
    expect(route?.element).toBeTruthy()
    expect(route?.element).toHaveProperty("type.name", "ListStudy")
  })

  it("should map profile to Profile component", () => {
    const route = AdminRouter.find(route => route.path === "admin/profile")
    expect(route?.element).toBeTruthy()
    expect(route?.element).toHaveProperty("type.name", "Profile")
  })
})
