import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type {
  BaseClinic,
  ClinicRequest,
  ClinicResponse,
} from "../../features/clinic/types/Clinic"
import type { Pagination, PaginationParams } from "../../types/Pagination"
import { API_URL, BASE_PATH } from "../../utils/ApiPath"

const CLINIC_PATH = BASE_PATH.clinic

export const clinicApi = createApi({
  reducerPath: "clinicApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["Clinic"],
  endpoints: builder => ({
    getAllClinics: builder.query<Pagination<ClinicResponse>, PaginationParams>({
      query: ({ page, pageSize, search }) => ({
        url: `${CLINIC_PATH}/page`,
        method: "GET",
        params: {
          pageIndex: page,
          pageSize: pageSize,
          searchTerm: search,
        },
      }),
      providesTags: result =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: "Clinic" as const,
                id,
              })),
              { type: "Clinic", id: "LIST" },
            ]
          : [{ type: "Clinic", id: "LIST" }],
    }),

    getClinic: builder.query<ClinicResponse, number>({
      query: clinicId => ({
        url: `${CLINIC_PATH}/${String(clinicId)}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Clinic" as const, id }],
    }),

    addClinic: builder.mutation<ClinicResponse, ClinicRequest>({
      query: clinic => ({
        url: CLINIC_PATH,
        method: "POST",
        body: clinic,
      }),
      invalidatesTags: [{ type: "Clinic", id: "LIST" }],
    }),

    updateClinic: builder.mutation<
      ClinicResponse,
      { id: number; clinic: BaseClinic }
    >({
      query: params => ({
        url: `${CLINIC_PATH}/${String(params.id)}/`,
        method: "PUT",
        body: params.clinic,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Clinic" as const, id },
        { type: "Clinic" as const, id: "LIST" },
      ],
    }),

    deleteClinic: builder.mutation<null, number>({
      query: clinicId => ({
        url: `${CLINIC_PATH}/${String(clinicId)}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Clinic" as const, id },
        { type: "Clinic" as const, id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetAllClinicsQuery,
  useGetClinicQuery,
  useAddClinicMutation,
  useUpdateClinicMutation,
  useDeleteClinicMutation,
} = clinicApi
