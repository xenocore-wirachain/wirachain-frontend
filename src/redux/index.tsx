import { configureStore } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"
import { authApi } from "./api/AuthAPI"
import { clinicApi } from "./api/ClinicAPI"
import { clinicAdminApi } from "./api/ClinicAdminAPI"
import { clinicPatientApi } from "./api/ClinicPatientAPI"
import { doctorApi } from "./api/DoctorAPI"
import { medicalConsultationApi } from "./api/MedicalConsultationAPI"
import { patientApi } from "./api/PatientAPI"
import { specialityApi } from "./api/SpecialityAPI"
import { studyApi } from "./api/StudyAPI"
import { AuthReducer } from "./slices/AuthSlice"
import { DataTableReducer } from "./slices/DataTableSlice"
import { ToastReducer } from "./slices/ToastSlice"

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    dataTable: DataTableReducer,
    toast: ToastReducer,
    [clinicApi.reducerPath]: clinicApi.reducer,
    [clinicAdminApi.reducerPath]: clinicAdminApi.reducer,
    [doctorApi.reducerPath]: doctorApi.reducer,
    [specialityApi.reducerPath]: specialityApi.reducer,
    [studyApi.reducerPath]: studyApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [clinicPatientApi.reducerPath]: clinicPatientApi.reducer,
    [medicalConsultationApi.reducerPath]: medicalConsultationApi.reducer,
    [patientApi.reducerPath]: patientApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(clinicApi.middleware)
      .concat(clinicAdminApi.middleware)
      .concat(doctorApi.middleware)
      .concat(specialityApi.middleware)
      .concat(studyApi.middleware)
      .concat(patientApi.middleware)
      .concat(clinicPatientApi.middleware)
      .concat(authApi.middleware)
      .concat(medicalConsultationApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export { useLoginMutation, useRefreshTokenMutation } from "./api/AuthAPI"
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
  useAddClinicPatientMutation,
  useGetAllClinicsPerPatientQuery,
  useRemoveClinicPatientMutation,
} from "./api/ClinicPatientAPI"
export {
  useAddDoctorMutation,
  useDeleteDoctorMutation,
  useGetAllDoctorsQuery,
  useGetDoctorQuery,
  useUpdateDoctorMutation,
} from "./api/DoctorAPI"
export {
  useAddMedicalConsultationMutation,
  useGetAllMedicalConsultationOfClinicQuery,
  useGetAllMedicalConsultationOfPatientQuery,
  useGetAllMedicalConsultationPerDoctorAndClinicQuery,
  useGetMedicalConsultationQuery,
} from "./api/MedicalConsultationAPI"
export {
  useAddPatientMutation,
  useGetPatientQuery,
  useGetPatientsPerClinicQuery,
  useUpdatePatientMutation,
} from "./api/PatientAPI"
export {
  useAddSpecialityMutation,
  useDeleteSpecialityMutation,
  useGetAllSpecialitiesQuery,
  useGetSpecialityQuery,
  useUpdateSpecialityMutation,
} from "./api/SpecialityAPI"
export {
  useAddStudyMutation,
  useDeleteStudyMutation,
  useGetAllStudiesQuery,
  useGetStudyQuery,
  useUpdateStudyMutation,
} from "./api/StudyAPI"
export {
  logout,
  selectCurrentUser,
  selectIsAuthenticated,
  setCredentials,
} from "./slices/AuthSlice"
export {
  modifyCreateDialog,
  modifyDeleteDialog,
  modifyIdSelected,
  modifyPage,
  modifySearch,
  modifyUpdateDialog,
} from "./slices/DataTableSlice"
export {
  clearToasts,
  showErrorToast,
  showInfoToast,
  showMultipleToasts,
  showSuccessToast,
  showToast,
  showWarnToast,
} from "./slices/ToastSlice"
