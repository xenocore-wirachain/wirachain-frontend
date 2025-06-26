import { render } from "@testing-library/react"
import { Toast } from "primereact/toast"
import { beforeEach, describe, expect, test, vi } from "vitest"
import GlobalToast from "../../src/components/GlobalToast"
import * as Redux from "../../src/redux"

// Mock the redux functions
vi.mock("../../src/redux", () => ({
  clearToasts: vi.fn(),
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}))

// Mock PrimeReact Toast component
vi.mock("primereact/toast", () => ({
  Toast: vi.fn(() => <div data-testid="mock-toast"></div>),
}))

describe("GlobalToast Component", () => {
  const mockDispatch = vi.fn()
  const mockToastShow = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock dispatch function
    vi.mocked(Redux.useAppDispatch).mockReturnValue(mockDispatch)

    // Mock the Toast show method
    Toast.prototype.show = mockToastShow

    // Mock clearToasts action creator
    vi.mocked(Redux.clearToasts).mockReturnValue({ type: "CLEAR_TOASTS" })
  })

  test("renders the component without crashing", () => {
    vi.mocked(Redux.useAppSelector).mockReturnValue({ messages: [] })

    const { container } = render(<GlobalToast />)
    expect(container).toBeDefined()
  })

  test("does not dispatch clearToasts when messages array is empty", () => {
    vi.mocked(Redux.useAppSelector).mockReturnValue({ messages: [] })

    render(<GlobalToast />)

    // With empty messages array, clearToasts should not be dispatched
    expect(mockDispatch).not.toHaveBeenCalled()
  })

  // This test is more challenging without useRef mocking,
  // but we can verify that useAppSelector was called correctly
  test("calls useAppSelector to get messages", () => {
    vi.mocked(Redux.useAppSelector).mockReturnValue({ messages: [] })

    render(<GlobalToast />)

    expect(Redux.useAppSelector).toHaveBeenCalled()
  })
})
