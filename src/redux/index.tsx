import { configureStore } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"
import { ClinicAPI } from "./api/ClinicAPI"
import { AuthReducer } from "./slices/AuthSlice"
import {
  DataTableReducer,
  modifyCreateDialog,
  modifyIdSelected,
  modifyUpdateDialog,
} from "./slices/DataTableSlice"

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    dataTable: DataTableReducer,
    [ClinicAPI.reducerPath]: ClinicAPI.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(ClinicAPI.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export {
  useAddClinicMutation,
  useGetAllClinicsQuery,
  useGetClinicQuery,
  useUpdateClinicMutation,
} from "./api/ClinicAPI"
export { modifyCreateDialog, modifyIdSelected, modifyUpdateDialog }
