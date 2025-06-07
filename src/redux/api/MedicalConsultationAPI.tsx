import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { UUID } from "crypto"
import type {
  MedicalConsultationRequest,
  MedicalConsultationResponse,
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
      providesTags: result =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: "MedicalConsultation" as const,
                id,
              })),
              { type: "MedicalConsultation", id: "LIST" },
            ]
          : [{ type: "MedicalConsultation", id: "LIST" }],
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
      providesTags: result =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: "MedicalConsultation" as const,
                id,
              })),
              { type: "MedicalConsultation", id: "LIST" },
            ]
          : [{ type: "MedicalConsultation", id: "LIST" }],
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
      invalidatesTags: [{ type: "MedicalConsultation" as const, id: "LIST" }],
    }),

    getMedicalConsultation: builder.query<MedicalConsultationResponse, UUID>({
      query: idMedicalConsultation => ({
        url: `${MEDICAL_CONSULTATION}/${idMedicalConsultation}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "MedicalConsultation" as const, id },
      ],
    }),
  }),
})

export const {
  useGetAllMedicalConsultationOfPatientQuery,
  useGetAllMedicalConsultationPerDoctorAndClinicQuery,
  useAddMedicalConsultationMutation,
  useGetMedicalConsultationQuery,
} = medicalConsultationApi
