import type { ToastMessage } from "primereact/toast"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { useToast } from "../../src/hooks/ToastHook"
import * as Redux from "../../src/redux"

// Mock Redux hooks and actions
vi.mock("../../src/redux", () => ({
  showSuccessToast: vi.fn(),
  showErrorToast: vi.fn(),
  showInfoToast: vi.fn(),
  showWarnToast: vi.fn(),
  showToast: vi.fn(),
  showMultipleToasts: vi.fn(),
  useAppDispatch: vi.fn(),
}))

describe("ToastHook", () => {
  const mockDispatch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    // Setup mock dispatch function
    vi.mocked(Redux.useAppDispatch).mockReturnValue(mockDispatch)

    // Setup mock action creators
    vi.mocked(Redux.showSuccessToast).mockImplementation(
      (summary, detail, life) => ({
        type: "showSuccessToast",
        payload: { summary, detail, life },
      }),
    )
    vi.mocked(Redux.showErrorToast).mockImplementation(
      (summary, detail, life) => ({
        type: "showErrorToast",
        payload: { summary, detail, life },
      }),
    )
    vi.mocked(Redux.showInfoToast).mockImplementation(
      (summary, detail, life) => ({
        type: "showInfoToast",
        payload: { summary, detail, life },
      }),
    )
    vi.mocked(Redux.showWarnToast).mockImplementation(
      (summary, detail, life) => ({
        type: "showWarnToast",
        payload: { summary, detail, life },
      }),
    )
    vi.mocked(Redux.showToast).mockImplementation(message => ({
      type: "showToast",
      payload: message,
    }))
    vi.mocked(Redux.showMultipleToasts).mockImplementation(messages => ({
      type: "showMultipleToasts",
      payload: messages,
    }))
  })

  test("showSuccess should dispatch showSuccessToast with correct parameters", () => {
    const hook = useToast()

    hook.showSuccess("Success", "Operation completed", 3000)

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(Redux.showSuccessToast).toHaveBeenCalledWith(
      "Success",
      "Operation completed",
      3000,
    )
  })

  test("showError should dispatch showErrorToast with correct parameters", () => {
    const hook = useToast()

    hook.showError("Error", "Operation failed", 5000)

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(Redux.showErrorToast).toHaveBeenCalledWith(
      "Error",
      "Operation failed",
      5000,
    )
  })

  test("showInfo should dispatch showInfoToast with correct parameters", () => {
    const hook = useToast()

    hook.showInfo("Info", "Operation in progress")

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(Redux.showInfoToast).toHaveBeenCalledWith(
      "Info",
      "Operation in progress",
      undefined,
    )
  })

  test("showWarn should dispatch showWarnToast with correct parameters", () => {
    const hook = useToast()

    hook.showWarn("Warning", "Proceed with caution")

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(Redux.showWarnToast).toHaveBeenCalledWith(
      "Warning",
      "Proceed with caution",
      undefined,
    )
  })

  test("showCustom should dispatch showToast for a single message", () => {
    const hook = useToast()
    const customMessage: ToastMessage = {
      severity: "custom",
      summary: "Custom",
      detail: "Custom message",
      life: 4000,
    }

    hook.showCustom(customMessage)

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(Redux.showToast).toHaveBeenCalledWith(customMessage)
  })

  test("showCustom should dispatch showMultipleToasts for an array of messages", () => {
    const hook = useToast()
    const customMessages: ToastMessage[] = [
      { severity: "custom", summary: "Custom 1", detail: "First message" },
      { severity: "custom", summary: "Custom 2", detail: "Second message" },
    ]

    hook.showCustom(customMessages)

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(Redux.showMultipleToasts).toHaveBeenCalledWith(customMessages)
  })
})
