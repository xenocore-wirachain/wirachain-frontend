import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { UUID } from "crypto"
import type { MedicalConsultationResponseDoctorAndClinic } from "../../types/MedicalConsultation"
import type { Pagination, PaginationParams } from "../../types/Pagination"
import { API_URL, BASE_PATH } from "../../utils/ApiPath"

const MEDICAL_CONSULTATION = BASE_PATH.medicalConsultation

export const medicalConsultationApi = createApi({
  reducerPath: "medicalConsultationApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["MedicalConsultation"],
  endpoints: builder => ({
    getAllMedicalConsultationPerDoctorAndClinic: builder.query<
      Pagination<MedicalConsultationResponseDoctorAndClinic>,
      { pagination: PaginationParams; idClinic: UUID; idDoctor: UUID }
    >({
      query: params => ({
        url: `${MEDICAL_CONSULTATION}/doctor/${params.idDoctor}/clinic/${params.idClinic}`,
        method: "GET",
        params: {
          pageIndex: params.pagination.page,
          pageSize: params.pagination.pageSize,
          searchTerm: params.pagination.search,
        },
      }),
    }),

    getAllMedicalConsultationOfPatient: builder.query<
      Pagination<MedicalConsultationResponseDoctorAndClinic>,
      { pagination: PaginationParams; idPatient: UUID }
    >({
      query: params => ({
        url: `${MEDICAL_CONSULTATION}/patient/${params.idPatient}`,
        method: "GET",
        params: {
          pageIndex: params.pagination.page,
          pageSize: params.pagination.pageSize,
          searchTerm: params.pagination.search,
        },
      }),
    }),
  }),
})

export const {
  useGetAllMedicalConsultationOfPatientQuery,
  useGetAllMedicalConsultationPerDoctorAndClinicQuery,
} = medicalConsultationApi
