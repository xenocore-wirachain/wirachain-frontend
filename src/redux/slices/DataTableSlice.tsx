import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import type { UUID } from "crypto"
import type { DataTable } from "../../types/Datatable"

const initialState: DataTable = {
  idSelected: 0,
  showCreateDialog: false,
  showUpdateDialog: false,
  showDeleteDialog: false,
  page: 1,
  pageSize: 10,
  search: "",
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
    modifyIdSelected: (state, action: PayloadAction<number | UUID>) => {
      state.idSelected = action.payload
    },
    modifySearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
    modifyPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
  },
})

export const {
  modifyCreateDialog,
  modifyUpdateDialog,
  modifyIdSelected,
  modifyDeleteDialog,
  modifySearch,
  modifyPage,
} = DataTableSlice.actions
export const DataTableReducer = DataTableSlice.reducer
