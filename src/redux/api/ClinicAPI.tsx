import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { ClinicRequest, ClinicResponse } from "../../types/Clinic"
import type { Pagination } from "../../types/Pagination"

const API_URL = import.meta.env.VITE_API_URL as string
const BASE_PATH = "/clinic/"

export const clinicApi = createApi({
  reducerPath: "clinicApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["Clinic"],
  endpoints: builder => ({
    getAllClinics: builder.query<Pagination<ClinicResponse>, null>({
      query: () => ({
        url: BASE_PATH,
        method: "GET",
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
        url: `${BASE_PATH}${String(clinicId)}/`,
        method: "GET",
      }),
      providesTags: (_, __, clinicId) => [{ type: "Clinic", id: clinicId }],
    }),

    addClinic: builder.mutation<ClinicResponse, ClinicRequest>({
      query: clinic => ({
        url: BASE_PATH,
        method: "POST",
        body: clinic,
      }),
      invalidatesTags: [{ type: "Clinic", id: "LIST" }],
    }),

    updateClinic: builder.mutation<ClinicResponse, ClinicResponse>({
      query: clinic => ({
        url: `${BASE_PATH}${String(clinic.id)}/`,
        method: "PUT",
        body: clinic,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Clinic", id },
        { type: "Clinic", id: "LIST" },
      ],
    }),

    deleteClinic: builder.mutation<null, number>({
      query: clinicId => ({
        url: `${BASE_PATH}${String(clinicId)}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, clinicId) => [
        { type: "Clinic", id: clinicId },
        { type: "Clinic", id: "LIST" },
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
