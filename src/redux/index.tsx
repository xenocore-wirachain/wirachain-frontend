import { configureStore } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"
import { clinicApi } from "./api/ClinicAPI"
import { clinicAdminApi } from "./api/ClinicAdminAPI"
import { doctorApi } from "./api/DoctorAPI"
import { AuthReducer } from "./slices/AuthSlice"
import { DataTableReducer } from "./slices/DataTableSlice"

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    dataTable: DataTableReducer,
    [clinicApi.reducerPath]: clinicApi.reducer,
    [clinicAdminApi.reducerPath]: clinicAdminApi.reducer,
    [doctorApi.reducerPath]: doctorApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(clinicApi.middleware)
      .concat(clinicAdminApi.middleware)
      .concat(doctorApi.middleware),
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
  useAddClinicAdminMutation,
  useDeleteClinicAdminMutation,
  useGetAllClinicAdminsQuery,
  useGetClinicAdminQuery,
  useUpdateClinicAdminMutation,
} from "./api/ClinicAdminAPI"
export {
  useAddDoctorMutation,
  useDeleteDoctorMutation,
  useGetAllDoctorsQuery,
  useGetDoctorQuery,
  useUpdateDoctorMutation,
} from "./api/DoctorAPI"
export {
  modifyCreateDialog,
  modifyDeleteDialog,
  modifyIdSelected,
  modifyPage,
  modifySearch,
  modifyUpdateDialog,
} from "./slices/DataTableSlice"
