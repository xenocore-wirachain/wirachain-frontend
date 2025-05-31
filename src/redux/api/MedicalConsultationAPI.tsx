import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { UUID } from "crypto"
import type {
  MedicalConsultationRequest,
  MedicalConsultationResponseDoctorAndClinic,
} from "../../types/MedicalConsultation"
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
      { pagination: PaginationParams; idClinic: number; idDoctor: UUID }
    >({
      query: params => ({
        url: `${MEDICAL_CONSULTATION}/doctor/${params.idDoctor}/clinic/${params.idClinic.toString()}`,
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

    addMedicalConsultation: builder.mutation<
      unknown,
      {
        consultation: MedicalConsultationRequest
        idPatient: UUID
        idDoctor: UUID
        idClinic: number
      }
    >({
      query: params => ({
        url: `${MEDICAL_CONSULTATION}/patient/${params.idPatient}/doctor/${params.idDoctor}/clinic/${params.idClinic.toString()}`,
        method: "POST",
        body: params.consultation,
      }),
    }),
  }),
})

export const {
  useGetAllMedicalConsultationOfPatientQuery,
  useGetAllMedicalConsultationPerDoctorAndClinicQuery,
  useAddMedicalConsultationMutation,
} = medicalConsultationApi
