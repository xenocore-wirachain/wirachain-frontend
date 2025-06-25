import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

// Create the mock functions without generic type parameters
const mockRender = vi.fn()
const mockRoot = { render: mockRender }
const mockCreateRoot = vi.fn().mockReturnValue(mockRoot)

// Mock the modules
vi.mock("react-dom/client", () => ({
  createRoot: mockCreateRoot,
}))

vi.mock("./redux", () => ({
  store: {},
}))

vi.mock("./routers", () => ({
  router: {},
}))

// Helper function for testing
const runMainModule = async (): Promise<void> => {
  try {
    vi.resetModules()
    await import("../src/main")
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Unknown error")
  }
}

describe("main.tsx", () => {
  let originalConsoleError: typeof console.error

  beforeEach(() => {
    originalConsoleError = console.error
    console.error = vi.fn()

    // Reset mocks
    vi.clearAllMocks()
    mockRender.mockClear()
    mockCreateRoot.mockClear()

    // Clear the document body
    document.body.innerHTML = ""
  })

  afterEach(() => {
    console.error = originalConsoleError
  })

  it("should render the app when root element exists", async () => {
    // Create a root element
    const rootElement = document.createElement("div")
    rootElement.id = "root"
    document.body.appendChild(rootElement)

    // Run the main module
    await runMainModule()

    // Verify createRoot was called with the root element
    expect(mockCreateRoot).toHaveBeenCalledTimes(1)
    expect(mockCreateRoot).toHaveBeenCalledWith(rootElement)

    // Verify render was called
    expect(mockRender).toHaveBeenCalledTimes(1)
  })

  it("should throw an error when root element does not exist", async () => {
    // The main module execution should throw when root doesn't exist
    await expect(runMainModule()).rejects.toThrow(
      "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
    )
  })
})
