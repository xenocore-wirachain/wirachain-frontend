import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import type { DataTable } from "../../types/Datatable"

const initialState: DataTable = {
  idSelected: 0,
  showCreateDialog: false,
  showUpdateDialog: false,
  showDeleteDialog: false,
  page: 0,
  pageSize: 10,
  searchItem: "",
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
    modifyDeleteDialog: (state, action: PayloadAction<boolean>) => {
      state.showDeleteDialog = action.payload
    },
    modifyIdSelected: (state, action: PayloadAction<number>) => {
      state.idSelected = action.payload
    },
  },
})

export const {
  modifyCreateDialog,
  modifyUpdateDialog,
  modifyIdSelected,
  modifyDeleteDialog,
} = DataTableSlice.actions
export const DataTableReducer = DataTableSlice.reducer
