import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { UUID } from "crypto"
import type {
  PatientRequest,
  PatientResponse,
} from "../../features/patient/types/Patient"
import type { Pagination, PaginationParams } from "../../types/Pagination"
import { API_URL, BASE_PATH } from "../../utils/ApiPath"

const PATIENT_PATH = BASE_PATH.patient

export const patientApi = createApi({
  reducerPath: "patientApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["Patient"],
  endpoints: builder => ({
    getPatientsPerClinic: builder.query<
      Pagination<PatientResponse>,
      { pagination: PaginationParams; idClinic: number }
    >({
      query: params => ({
        url: `${PATIENT_PATH}/clinic/${params.idClinic.toString()}`,
        method: "GET",
        params: {
          pageIndex: params.pagination.page,
          pageSize: params.pagination.pageSize,
          searchTerm: params.pagination.search,
        },
      }),
    }),

    getPatient: builder.query<PatientResponse, UUID>({
      query: patientId => ({
        url: `${PATIENT_PATH}/${patientId}`,
        method: "GET",
      }),
    }),

    addPatient: builder.mutation<PatientResponse, PatientRequest>({
      query: patient => ({
        url: PATIENT_PATH,
        method: "POST",
        body: patient,
      }),
    }),

    updatePatient: builder.mutation<
      PatientResponse,
      { id: UUID; patient: PatientRequest }
    >({
      query: params => ({
        url: `${PATIENT_PATH}/${params.id}`,
        method: "PUT",
        body: params.patient,
      }),
    }),
  }),
})

export const {
  useAddPatientMutation,
  useGetPatientQuery,
  useUpdatePatientMutation,
  useGetPatientsPerClinicQuery,
} = patientApi
