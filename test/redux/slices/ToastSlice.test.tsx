import { describe, expect, it } from "vitest"
import {
  ToastReducer,
  clearToasts,
  showErrorToast,
  showInfoToast,
  showMultipleToasts,
  showSuccessToast,
  showToast,
  showWarnToast,
} from "../../../src/redux/slices/ToastSlice"

describe("ToastSlice", () => {
  describe("reducer", () => {
    it("should return the initial state", () => {
      const initialState = {
        messages: [],
        counter: 0,
      }

      expect(ToastReducer(undefined, { type: "unknown" })).toEqual(initialState)
    })

    it("should handle showToast", () => {
      const mockToast = {
        severity: "success",
        summary: "Success",
        detail: "Operation completed successfully",
        life: 3000,
      }

      const actual = ToastReducer(undefined, showToast(mockToast))

      expect(actual.messages).toHaveLength(1)
      expect(actual.messages[0]).toEqual({
        ...mockToast,
        id: "0",
      })
      expect(actual.counter).toBe(1)
    })

    it("should handle showMultipleToasts", () => {
      const mockToasts = [
        {
          severity: "success",
          summary: "Success 1",
          detail: "First operation completed",
          life: 3000,
        },
        {
          severity: "info",
          summary: "Info 1",
          detail: "Some information",
          life: 3000,
        },
      ]

      const actual = ToastReducer(undefined, showMultipleToasts(mockToasts))

      expect(actual.messages).toHaveLength(2)
      expect(actual.messages[0]).toEqual({
        ...mockToasts[0],
        id: "0",
      })
      expect(actual.messages[1]).toEqual({
        ...mockToasts[1],
        id: "1",
      })
      expect(actual.counter).toBe(2)
    })

    it("should handle clearToasts", () => {
      // First add some toasts
      const stateWithToasts = ToastReducer(
        undefined,
        showToast({
          severity: "success",
          summary: "Success",
          detail: "Operation completed successfully",
          life: 3000,
        }),
      )

      // Then clear them
      const actual = ToastReducer(stateWithToasts, clearToasts())

      expect(actual.messages).toEqual([])
      expect(actual.counter).toBe(1) // Counter should not reset
    })
  })

  describe("toast action creators", () => {
    it("should create a success toast action", () => {
      const action = showSuccessToast("Success", "Operation completed")

      expect(action.payload).toEqual({
        severity: "success",
        summary: "Success",
        detail: "Operation completed",
        life: 3000,
      })
    })

    it("should create an error toast action", () => {
      const action = showErrorToast("Error", "Operation failed")

      expect(action.payload).toEqual({
        severity: "error",
        summary: "Error",
        detail: "Operation failed",
        life: 5000,
      })
    })

    it("should create an info toast action", () => {
      const action = showInfoToast("Info", "Information message")

      expect(action.payload).toEqual({
        severity: "info",
        summary: "Info",
        detail: "Information message",
        life: 3000,
      })
    })

    it("should create a warning toast action", () => {
      const action = showWarnToast("Warning", "Warning message")

      expect(action.payload).toEqual({
        severity: "warn",
        summary: "Warning",
        detail: "Warning message",
        life: 3000,
      })
    })

    it("should allow custom life duration", () => {
      const action = showSuccessToast("Success", "Quick message", 1000)

      expect(action.payload.life).toBe(1000)
    })
  })
})
