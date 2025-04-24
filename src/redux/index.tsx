import { configureStore } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"
import { clinicApi } from "./api/ClinicAPI"
import { AuthReducer } from "./slices/AuthSlice"
import {
  DataTableReducer,
  modifyCreateDialog,
  modifyDeleteDialog,
  modifyIdSelected,
  modifyUpdateDialog,
} from "./slices/DataTableSlice"

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    dataTable: DataTableReducer,
    [clinicApi.reducerPath]: clinicApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(clinicApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export {
  useAddClinicMutation,
  useDeleteClinicMutation,
  useGetAllClinicsQuery,
  useGetClinicQuery,
  useUpdateClinicMutation,
} from "./api/ClinicAPI"
export {
  modifyCreateDialog,
  modifyDeleteDialog,
  modifyIdSelected,
  modifyUpdateDialog,
}
