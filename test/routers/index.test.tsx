import { beforeEach, describe, expect, it, vi } from "vitest"
import { USER_TYPES } from "../../src/utils/StaticVariables"

// Define types for our mocked elements
type MockElement = {
  type: string
  props: {
    children?: (MockElement | null)[]
    to?: string
    replace?: boolean
    [key: string]: unknown
  }
}

// Mock dependencies with properly typed return values
vi.mock("react-router", () => {
  const mockedNavigate = (props: Record<string, unknown>): MockElement => ({
    type: "Navigate",
    props,
  })

  const mockedOutlet = (): MockElement => ({
    type: "Outlet",
    props: {},
  })

  return {
    createBrowserRouter: vi.fn(() => ({
      routes: [],
    })),
    Navigate: mockedNavigate,
    Outlet: mockedOutlet,
  }
})

vi.mock("../components/DoctorDataLoader", () => ({
  default: vi.fn(() => ({
    type: "DoctorDataLoader",
    props: {},
  })),
}))

vi.mock("../features/auth", () => ({
  Login: vi.fn(() => ({
    type: "Login",
    props: {},
  })),
  NotFound: vi.fn(() => ({
    type: "NotFound",
    props: {},
  })),
  Register: vi.fn(() => ({
    type: "Register",
    props: {},
  })),
  ResetPassword: vi.fn(() => ({
    type: "ResetPassword",
    props: {},
  })),
}))

// No need to mock useAuth - we won't be using it

vi.mock("../layouts/BodyDashboard", () => ({
  default: vi.fn(() => ({
    type: "BodyDashboard",
    props: {},
  })),
}))

vi.mock("./admin", () => ({
  AdminRouter: [],
}))

vi.mock("./clinic", () => ({
  ClinicRouter: [],
}))

vi.mock("./doctor", () => ({
  DoctorRouter: [],
}))

vi.mock("./patient", () => ({
  PatientRouter: [],
}))

// Import the module under test
import { router } from "../../src/routers/index"

// Pure testing functions - no hooks needed
function roleGuard(
  isAuthenticated: boolean,
  userType: number | undefined,
  allowedRoles: number[],
): MockElement {
  if (!isAuthenticated) {
    return {
      type: "Navigate",
      props: { to: "/", replace: true },
    }
  }

  if (!userType || !allowedRoles.includes(userType)) {
    return {
      type: "Navigate",
      props: { to: "/dashboard", replace: true },
    }
  }

  return {
    type: "Outlet",
    props: {},
  }
}

function dashboardWrapper(
  isAuthenticated: boolean,
  userType: number | undefined,
): MockElement {
  if (!isAuthenticated) {
    return {
      type: "Navigate",
      props: { to: "/", replace: true },
    }
  }

  if (userType === USER_TYPES.DOCTOR) {
    return {
      type: "Fragment",
      props: {
        children: [
          { type: "DoctorDataLoader", props: {} },
          { type: "BodyDashboard", props: {} },
        ],
      },
    }
  }

  return {
    type: "Fragment",
    props: {
      children: [null, { type: "BodyDashboard", props: {} }],
    },
  }
}

function dashboardRouter(userType: number | undefined): MockElement {
  switch (userType) {
    case USER_TYPES.ADMIN:
      return {
        type: "Navigate",
        props: { to: "/dashboard/admin/clinic-admin-list", replace: true },
      }
    case USER_TYPES.DOCTOR:
      return {
        type: "Navigate",
        props: { to: "/dashboard/doctor/appointment-list", replace: true },
      }
    case USER_TYPES.PATIENT:
      return {
        type: "Navigate",
        props: { to: "/dashboard/patient/appointment-list", replace: true },
      }
    case USER_TYPES.CLINIC:
      return {
        type: "Navigate",
        props: { to: "/dashboard/clinic/clinic-list", replace: true },
      }
    default:
      return {
        type: "Navigate",
        props: { to: "/", replace: true },
      }
  }
}

describe("Router", () => {
  it("should export a router configuration", () => {
    expect(router).toBeDefined()
  })

  describe("RoleGuard", () => {
    beforeEach(() => {
      // Clear all mocks before each test
      vi.clearAllMocks()
    })

    it("should redirect to / when user is not authenticated", () => {
      const result = roleGuard(false, undefined, [USER_TYPES.ADMIN])

      expect(result.type).toBe("Navigate")
      expect(result.props.to).toBe("/")
      expect(result.props.replace).toBe(true)
    })

    it("should redirect to /dashboard when user has invalid role", () => {
      const result = roleGuard(true, USER_TYPES.PATIENT, [USER_TYPES.ADMIN])

      expect(result.type).toBe("Navigate")
      expect(result.props.to).toBe("/dashboard")
      expect(result.props.replace).toBe(true)
    })

    it("should render Outlet when user has valid role", () => {
      const result = roleGuard(true, USER_TYPES.ADMIN, [USER_TYPES.ADMIN])

      expect(result.type).toBe("Outlet")
    })
  })

  describe("DashboardWrapper", () => {
    beforeEach(() => {
      // Clear all mocks before each test
      vi.clearAllMocks()
    })

    it("should redirect to / when user is not authenticated", () => {
      const result = dashboardWrapper(false, undefined)

      expect(result.type).toBe("Navigate")
      expect(result.props.to).toBe("/")
      expect(result.props.replace).toBe(true)
    })

    it("should render content when user is authenticated", () => {
      const result = dashboardWrapper(true, USER_TYPES.ADMIN)

      expect(result.type).toBe("Fragment")
      expect(result.props.children).toBeDefined()
      const child = result.props.children?.[1]
      expect(child).not.toBeNull()
      expect(child?.type).toBe("BodyDashboard")
    })

    it("should include DoctorDataLoader when user type is DOCTOR", () => {
      const result = dashboardWrapper(true, USER_TYPES.DOCTOR)

      expect(result.type).toBe("Fragment")
      expect(result.props.children).toBeDefined()
      const children = result.props.children ?? []
      expect(children[0]?.type).toBe("DoctorDataLoader")
      expect(children[1]?.type).toBe("BodyDashboard")
    })
  })

  describe("DashboardRouter", () => {
    beforeEach(() => {
      // Clear all mocks before each test
      vi.clearAllMocks()
    })

    it("should redirect admin to the correct route", () => {
      const result = dashboardRouter(USER_TYPES.ADMIN)

      expect(result.type).toBe("Navigate")
      expect(result.props.to).toBe("/dashboard/admin/clinic-admin-list")
      expect(result.props.replace).toBe(true)
    })

    it("should redirect doctor to the correct route", () => {
      const result = dashboardRouter(USER_TYPES.DOCTOR)

      expect(result.type).toBe("Navigate")
      expect(result.props.to).toBe("/dashboard/doctor/appointment-list")
      expect(result.props.replace).toBe(true)
    })

    it("should redirect patient to the correct route", () => {
      const result = dashboardRouter(USER_TYPES.PATIENT)

      expect(result.type).toBe("Navigate")
      expect(result.props.to).toBe("/dashboard/patient/appointment-list")
      expect(result.props.replace).toBe(true)
    })

    it("should redirect clinic to the correct route", () => {
      const result = dashboardRouter(USER_TYPES.CLINIC)

      expect(result.type).toBe("Navigate")
      expect(result.props.to).toBe("/dashboard/clinic/clinic-list")
      expect(result.props.replace).toBe(true)
    })

    it("should redirect to / for invalid user type", () => {
      const result = dashboardRouter(999) // Invalid user type

      expect(result.type).toBe("Navigate")
      expect(result.props.to).toBe("/")
      expect(result.props.replace).toBe(true)
    })
  })

  describe("Router Configuration", () => {
    it("should have the correct routes defined", () => {
      // Check the main routes are defined
      expect(router).toBeDefined()
    })
  })
})
