import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import type { DataTable } from "../../types/Datatable"

const initialState: DataTable = {
  showCreateDialog: false,
  showUpdateDialog: false,
}

export const DataTableSlice = createSlice({
  name: "datatable",
  initialState,
  reducers: {
    modifyCreateDialog: (state, action: PayloadAction<boolean>) => {
      state.showCreateDialog = action.payload
    },
    modifyUpdateDialog: (state, action: PayloadAction<boolean>) => {
      state.showUpdateDialog = action.payload
    },
  },
})

export const { modifyCreateDialog, modifyUpdateDialog } = DataTableSlice.actions
export const DataTableReducer = DataTableSlice.reducer
