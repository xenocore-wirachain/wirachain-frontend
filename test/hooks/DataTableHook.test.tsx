import { beforeEach, describe, expect, test, vi } from "vitest"
import { useDataTableHook } from "../../src/hooks/DataTableHook"
import * as ToastHook from "../../src/hooks/ToastHook"
import * as Redux from "../../src/redux"

// Mock Redux hooks and actions
vi.mock("../../src/redux", () => ({
  modifyCreateDialog: vi.fn(),
  modifyDeleteDialog: vi.fn(),
  modifyIdSelected: vi.fn(),
  modifyPage: vi.fn(),
  modifySearch: vi.fn(),
  modifyUpdateDialog: vi.fn(),
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}))

// Mock ToastHook
vi.mock("../../src/hooks/ToastHook", () => ({
  useToast: vi.fn(),
}))

describe("DataTableHook", () => {
  const mockDispatch = vi.fn()
  const mockToast = {
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showInfo: vi.fn(),
    showWarn: vi.fn(),
    showCustom: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Setup mock return values
    vi.mocked(Redux.useAppDispatch).mockReturnValue(mockDispatch)
    vi.mocked(Redux.useAppSelector).mockReturnValue({
      page: 1,
      pageSize: 10,
      search: "",
      idSelected: null,
      showCreateDialog: false,
      showUpdateDialog: false,
      showDeleteDialog: false,
    })
    vi.mocked(ToastHook.useToast).mockReturnValue(mockToast)

    // Setup mock action creators
    vi.mocked(Redux.modifyCreateDialog).mockImplementation(value => ({
      type: "modifyCreateDialog",
      payload: value,
    }))
    vi.mocked(Redux.modifyDeleteDialog).mockImplementation(value => ({
      type: "modifyDeleteDialog",
      payload: value,
    }))
    vi.mocked(Redux.modifyIdSelected).mockImplementation(value => ({
      type: "modifyIdSelected",
      payload: value,
    }))
    vi.mocked(Redux.modifyPage).mockImplementation(value => ({
      type: "modifyPage",
      payload: value,
    }))
    vi.mocked(Redux.modifySearch).mockImplementation(value => ({
      type: "modifySearch",
      payload: value,
    }))
    vi.mocked(Redux.modifyUpdateDialog).mockImplementation(value => ({
      type: "modifyUpdateDialog",
      payload: value,
    }))
  })

  test("should return initial state values", () => {
    const hook = useDataTableHook()

    expect(hook.page).toBe(1)
    expect(hook.pageSize).toBe(10)
    expect(hook.search).toBe("")
    expect(hook.idSelected).toBe(null)
    expect(hook.showCreateDialog).toBe(false)
    expect(hook.showUpdateDialog).toBe(false)
    expect(hook.showDeleteDialog).toBe(false)
  })

  test("openUpdateDialog should dispatch modifyIdSelected and modifyUpdateDialog", () => {
    const hook = useDataTableHook()
    const testId = "123"

    hook.openUpdateDialog(testId)

    expect(mockDispatch).toHaveBeenCalledTimes(2)
    expect(Redux.modifyIdSelected).toHaveBeenCalledWith(testId)
    expect(Redux.modifyUpdateDialog).toHaveBeenCalledWith(true)
  })

  test("openDeleteDialog should dispatch modifyIdSelected and modifyDeleteDialog", () => {
    const hook = useDataTableHook()
    const testId = 456

    hook.openDeleteDialog(testId)

    expect(mockDispatch).toHaveBeenCalledTimes(2)
    expect(Redux.modifyIdSelected).toHaveBeenCalledWith(testId)
    expect(Redux.modifyDeleteDialog).toHaveBeenCalledWith(true)
  })

  test("openCreateDialog should dispatch modifyCreateDialog", () => {
    const hook = useDataTableHook()

    hook.openCreateDialog()

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(Redux.modifyCreateDialog).toHaveBeenCalledWith(true)
  })

  test("closeAllDialogs should dispatch all dialog actions with false", () => {
    const hook = useDataTableHook()

    hook.closeAllDialogs()

    expect(mockDispatch).toHaveBeenCalledTimes(3)
    expect(Redux.modifyCreateDialog).toHaveBeenCalledWith(false)
    expect(Redux.modifyDeleteDialog).toHaveBeenCalledWith(false)
    expect(Redux.modifyUpdateDialog).toHaveBeenCalledWith(false)
  })

  test("handlePageChange should calculate new page and dispatch modifyPage", () => {
    const hook = useDataTableHook()
    const event = { first: 20, rows: 10 }

    hook.handlePageChange(event)

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(Redux.modifyPage).toHaveBeenCalledWith(3) // (20/10) + 1 = 3
  })

  test("handleSearch should dispatch modifySearch with input value", () => {
    const hook = useDataTableHook()
    const mockEvent = {
      target: { value: "test search" },
    } as React.ChangeEvent<HTMLInputElement>

    hook.handleSearch(mockEvent)

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(Redux.modifySearch).toHaveBeenCalledWith("test search")
  })

  test("handleApiError should call toast.showError with error message for Error instances", () => {
    const hook = useDataTableHook()
    const testError = new Error("Test API error")

    hook.handleApiError(testError)

    expect(mockToast.showError).toHaveBeenCalledWith("Error", "Test API error")
  })

  test("handleApiError should call toast.showError with default message for non-Error instances", () => {
    const hook = useDataTableHook()

    hook.handleApiError("Not an error object")

    expect(mockToast.showError).toHaveBeenCalledWith(
      "Error",
      "Error desconocido",
    )
  })

  test("handleError should call toast.showError with error message for Error instances", () => {
    const hook = useDataTableHook()
    const testError = new Error("Test general error")

    hook.handleError(testError)

    expect(mockToast.showError).toHaveBeenCalledWith(
      "Error",
      "Test general error",
    )
  })

  test("handleError should call toast.showError with default message for non-Error instances", () => {
    const hook = useDataTableHook()

    hook.handleError({ custom: "error" })

    expect(mockToast.showError).toHaveBeenCalledWith(
      "Error",
      "Error desconocido",
    )
  })

  test("handleIdError should call toast.showError with ID error message", () => {
    const hook = useDataTableHook()

    hook.handleIdError()

    expect(mockToast.showError).toHaveBeenCalledWith("Error", "ID no válido")
  })
})
