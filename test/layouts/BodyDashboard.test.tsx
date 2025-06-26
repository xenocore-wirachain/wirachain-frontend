import { configureStore } from "@reduxjs/toolkit"
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { beforeEach, describe, expect, test, vi } from "vitest"
import BodyDashboard from "../../src/layouts/BodyDashboard"

// Create a more complete mock Redux store
const createMockStore = () =>
  configureStore({
    reducer: {
      toast: (state = { messages: [] }, action) => state,
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

// Mock dependencies
vi.mock(
  "../src/components/GlobalToast",
  () => ({
    __esModule: true,
    default: () => <div data-testid="global-toast-mock">Global Toast Mock</div>,
  }),
  { virtual: true },
)

vi.mock(
  "../src/layouts/BaseMenu",
  () => ({
    __esModule: true,
    default: () => <div data-testid="base-menu-mock">Base Menu Mock</div>,
  }),
  { virtual: true },
)

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router")
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet-content">Outlet Content Mock</div>,
    useNavigate: () => vi.fn(),
  }
})

vi.mock(
  "primereact/scrollpanel",
  () => ({
    __esModule: true,
    ScrollPanel: ({ children, className }) => (
      <div data-testid="scroll-panel" className={className}>
        {children}
      </div>
    ),
  }),
  { virtual: true },
)

// Helper function to render with all providers
const renderWithProviders = component => {
  const store = createMockStore()
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>,
  )
}

describe("BodyDashboard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("renders all required components", () => {
    renderWithProviders(<BodyDashboard />)

    // Check for main components using data attributes and classes that are unique
    expect(screen.getByTestId("scroll-panel")).toBeInTheDocument()
    expect(screen.getByTestId("outlet-content")).toBeInTheDocument()

    // Check for the toast component using data-pc-name attribute
    expect(document.querySelector('[data-pc-name="toast"]')).toBeInTheDocument()

    // Check for the menubar component
    expect(screen.getByRole("menubar")).toBeInTheDocument()
  })

  test("has correct layout structure", () => {
    renderWithProviders(<BodyDashboard />)

    // Check main container classes
    const mainContainer = screen.getByTestId("scroll-panel").parentElement
    expect(mainContainer).toHaveClass(
      "max-h-screen",
      "max-w-screen",
      "flex",
      "flex-col",
    )

    // Check header section - using querySelector to find the correct element
    const menuContainer = document.querySelector(".w-full.basis-\\[5vh\\]")
    expect(menuContainer).toHaveClass("w-full", "basis-[5vh]", "px-8", "py-4")

    // Check scroll panel
    const scrollPanel = screen.getByTestId("scroll-panel")
    expect(scrollPanel).toHaveClass("w-full", "basis-[95vh]", "px-8")
  })

  test("scroll panel contains outlet content", () => {
    renderWithProviders(<BodyDashboard />)

    const scrollPanel = screen.getByTestId("scroll-panel")
    const outlet = screen.getByTestId("outlet-content")
    expect(scrollPanel).toContainElement(outlet)
  })
})
