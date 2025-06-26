import { describe, expect, it } from "vitest"
import {
  DataTableReducer,
  modifyCreateDialog,
  modifyDeleteDialog,
  modifyIdSelected,
  modifyPage,
  modifySearch,
  modifyUpdateDialog,
} from "../../../src/redux/slices/DataTableSlice"

describe("DataTableSlice", () => {
  describe("reducer", () => {
    it("should return the initial state", () => {
      const initialState = {
        idSelected: 0,
        showCreateDialog: false,
        showUpdateDialog: false,
        showDeleteDialog: false,
        page: 1,
        pageSize: 10,
        search: "",
      }

      expect(DataTableReducer(undefined, { type: "unknown" })).toEqual(
        initialState,
      )
    })

    it("should handle modifyCreateDialog", () => {
      const actual = DataTableReducer(undefined, modifyCreateDialog(true))

      expect(actual.showCreateDialog).toBe(true)
    })

    it("should handle modifyUpdateDialog", () => {
      const actual = DataTableReducer(undefined, modifyUpdateDialog(true))

      expect(actual.showUpdateDialog).toBe(true)
    })

    it("should handle modifyDeleteDialog", () => {
      const actual = DataTableReducer(undefined, modifyDeleteDialog(true))

      expect(actual.showDeleteDialog).toBe(true)
    })

    it("should handle modifyIdSelected with number", () => {
      const actual = DataTableReducer(undefined, modifyIdSelected(123))

      expect(actual.idSelected).toBe(123)
    })

    it("should handle modifyIdSelected with UUID", () => {
      const uuid = "550e8400-e29b-41d4-a716-446655440000"
      const actual = DataTableReducer(undefined, modifyIdSelected(uuid))

      expect(actual.idSelected).toBe(uuid)
    })

    it("should handle modifySearch", () => {
      const actual = DataTableReducer(undefined, modifySearch("test search"))

      expect(actual.search).toBe("test search")
    })

    it("should handle modifyPage", () => {
      const actual = DataTableReducer(undefined, modifyPage(5))

      expect(actual.page).toBe(5)
    })

    it("should preserve other state properties when modifying one property", () => {
      // Start with non-default state
      const customState = {
        idSelected: 123,
        showCreateDialog: true,
        showUpdateDialog: true,
        showDeleteDialog: true,
        page: 3,
        pageSize: 10,
        search: "existing search",
      }

      // Modify just the page
      const actual = DataTableReducer(customState, modifyPage(5))

      // Check all properties
      expect(actual).toEqual({
        ...customState,
        page: 5, // Only this should change
      })
    })
  })
})
