import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { UUID } from "crypto"
import type {
  AddClinicPatientRequest,
  AddClinicpatientResponse,
  ClinicPatientResponse,
} from "../../features/patient/utils/ClinicPatient"
import type { Pagination, PaginationParams } from "../../types/Pagination"
import { API_URL, BASE_PATH } from "../../utils/ApiPath"

const CLINIC_PATH = BASE_PATH.clinic
const PATIENT_PATH = BASE_PATH.patient

export const clinicPatientApi = createApi({
  reducerPath: "clinicPatientApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["ClinicPatient"],
  endpoints: builder => ({
    getAllClinicsPerPatient: builder.query<
      Pagination<ClinicPatientResponse>,
      {
        pagination: PaginationParams
        idPatient: UUID
      }
    >({
      query: params => ({
        url: `${CLINIC_PATH}/patient/${params.idPatient}`,
        method: "GET",
        params: {
          pageIndex: params.pagination.page,
          pageSize: params.pagination.pageSize,
          searchTerm: params.pagination.search,
        },
      }),
      providesTags: result =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: "ClinicPatient" as const,
                id,
              })),
              { type: "ClinicPatient", id: "LIST" },
            ]
          : [{ type: "ClinicPatient", id: "LIST" }],
    }),

    addClinicPatient: builder.mutation<
      AddClinicpatientResponse,
      AddClinicPatientRequest
    >({
      query: clinicPatient => ({
        url: `${PATIENT_PATH}/${clinicPatient.patientId}/clinic/${clinicPatient.clinicId.toString()}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "ClinicPatient", id: "LIST" }],
    }),
  }),
})

export const { useGetAllClinicsPerPatientQuery, useAddClinicPatientMutation } =
  clinicPatientApi
