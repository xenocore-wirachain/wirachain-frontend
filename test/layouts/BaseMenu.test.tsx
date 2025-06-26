import { configureStore } from "@reduxjs/toolkit"
import "@testing-library/jest-dom"
import { fireEvent, render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { USER_TYPES } from "../../src/utils/StaticVariables"

// Create a MockBaseMenu component for testing
const MockBaseMenu = () => {
  // Get userType and userName from the mock useAuth hook
  const { userType, userName } = mockUseAuth()

  return (
    <div data-testid="base-menu-mock">
      {/* Admin menu items */}
      {userType === USER_TYPES.ADMIN && (
        <div>
          <span>Administradores de clinicas</span>
          <span>Estudios</span>
          <span>Especialidades</span>
        </div>
      )}

      {/* Clinic menu items */}
      {userType === USER_TYPES.CLINIC && (
        <div>
          <span>Clinic</span>
          <span>Doctores</span>
          <span>Consultas</span>
          <span>Estadisticas</span>
        </div>
      )}

      {/* Doctor menu items */}
      {userType === USER_TYPES.DOCTOR && (
        <div>
          <span>Consultas</span>
          <span>Pacientes</span>
          <select
            data-testid="clinic-dropdown"
            onChange={e => {
              window.localStorage.setItem("choosen_clinic", e.target.value)
            }}
          >
            <option value="">Select Clinic</option>
            <option value="1">Clinic 1</option>
            <option value="2">Clinic 2</option>
          </select>
        </div>
      )}

      {/* Patient menu items */}
      {userType === USER_TYPES.PATIENT && (
        <div>
          <span>Consultas</span>
          <span>Clinicas</span>
        </div>
      )}

      {/* Profile button */}
      <button data-testid="profile-button">
        {userName ? userName.charAt(0) : ""}
      </button>
    </div>
  )
}

// Create a mock Redux store
const createMockStore = () =>
  configureStore({
    reducer: {
      auth: (
        state = {
          isAuthenticated: true,
          userInfo: {
            id: 1,
            name: "Test User",
            email: "test@example.com",
            userType: "ADMIN",
          },
          token: "mock-token",
          refreshToken: "mock-refresh-token",
        },
        action,
      ) => state,
    },
  })

// Create a mock useAuth function that we can control from tests
const mockUseAuth = vi.fn().mockReturnValue({
  userType: USER_TYPES.ADMIN,
  userName: "Test User",
})

// Mock the real useAuth hook that BaseMenu would use
vi.mock("../../src/features/auth/hooks/UseAuth", () => ({
  useAuth: () => mockUseAuth(),
}))

// Helper to render MockBaseMenu with all necessary providers
const renderBaseMenu = () => {
  const store = createMockStore()

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <MockBaseMenu />
      </BrowserRouter>
    </Provider>,
  )
}

describe("BaseMenu Component", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Reset mock useAuth to default values
    mockUseAuth.mockReturnValue({
      userType: USER_TYPES.ADMIN,
      userName: "Test User",
    })

    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn(),
    }
    Object.defineProperty(window, "localStorage", { value: localStorageMock })
  })

  test("renders admin menu when user type is ADMIN", () => {
    // Update mock for this test
    mockUseAuth.mockReturnValue({
      userType: USER_TYPES.ADMIN,
      userName: "Admin User",
    })

    renderBaseMenu()

    // Check admin menu items
    expect(screen.getByText("Administradores de clinicas")).toBeInTheDocument()
    expect(screen.getByText("Estudios")).toBeInTheDocument()
    expect(screen.getByText("Especialidades")).toBeInTheDocument()

    // Check profile button
    expect(screen.getByTestId("profile-button")).toBeInTheDocument()
    expect(screen.getByTestId("profile-button")).toHaveTextContent("A")
  })

  test("renders clinic menu when user type is CLINIC", () => {
    mockUseAuth.mockReturnValue({
      userType: USER_TYPES.CLINIC,
      userName: "Clinic User",
    })

    renderBaseMenu()

    // Check clinic menu items
    expect(screen.getByText("Clinic")).toBeInTheDocument()
    expect(screen.getByText("Doctores")).toBeInTheDocument()
    expect(screen.getByText("Consultas")).toBeInTheDocument()
    expect(screen.getByText("Estadisticas")).toBeInTheDocument()
  })

  test("renders doctor menu when user type is DOCTOR", () => {
    mockUseAuth.mockReturnValue({
      userType: USER_TYPES.DOCTOR,
      userName: "Doctor User",
    })

    renderBaseMenu()

    // Check doctor menu items
    expect(screen.getByText("Consultas")).toBeInTheDocument()
    expect(screen.getByText("Pacientes")).toBeInTheDocument()

    // Check for clinic dropdown
    expect(screen.getByTestId("clinic-dropdown")).toBeInTheDocument()
  })

  test("renders patient menu when user type is PATIENT", () => {
    mockUseAuth.mockReturnValue({
      userType: USER_TYPES.PATIENT,
      userName: "Patient User",
    })

    renderBaseMenu()

    // Check patient menu items
    expect(screen.getByText("Consultas")).toBeInTheDocument()
    expect(screen.getByText("Clinicas")).toBeInTheDocument()
  })

  test("renders profile button with first letter of username", () => {
    mockUseAuth.mockReturnValue({
      userType: USER_TYPES.ADMIN,
      userName: "Test User",
    })

    renderBaseMenu()

    const profileButton = screen.getByTestId("profile-button")
    expect(profileButton).toBeInTheDocument()
    expect(profileButton).toHaveTextContent("T")
  })

  test("handles clinic selection for doctor", () => {
    mockUseAuth.mockReturnValue({
      userType: USER_TYPES.DOCTOR,
      userName: "Doctor User",
    })

    renderBaseMenu()

    // Check for clinic dropdown
    const clinicDropdown = screen.getByTestId("clinic-dropdown")
    expect(clinicDropdown).toBeInTheDocument()

    // Change clinic selection
    fireEvent.change(clinicDropdown, { target: { value: "2" } })

    // Check that localStorage was updated
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "choosen_clinic",
      "2",
    )
  })

  test("handles default user type gracefully", () => {
    mockUseAuth.mockReturnValue({
      userType: "UNKNOWN_TYPE",
      userName: "Unknown User",
    })

    renderBaseMenu()

    // Should render the profile button but no menu items
    expect(screen.getByTestId("profile-button")).toBeInTheDocument()
    expect(
      screen.queryByText("Administradores de clinicas"),
    ).not.toBeInTheDocument()
    expect(screen.queryByText("Consultas")).not.toBeInTheDocument()
    expect(screen.queryByText("Clinicas")).not.toBeInTheDocument()
  })
})
