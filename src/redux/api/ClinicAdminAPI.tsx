import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { UUID } from "crypto"
import type {
  ClinicAdminRequest,
  ClinicAdminResponse,
} from "../../types/ClinicAdmin"
import type { Pagination, PaginationParams } from "../../types/Pagination"
import { API_URL, BASE_PATH } from "../../utils/ApiPath"

const CLINIC_ADMIN_PATH = BASE_PATH.clinicAdministration

export const clinicAdminApi = createApi({
  reducerPath: "clinicAdminApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["ClinicAdmin"],
  endpoints: builder => ({
    getAllClinicAdmins: builder.query<
      Pagination<ClinicAdminResponse>,
      PaginationParams
    >({
      query: ({ page, pageSize, search }) => ({
        url: `${CLINIC_ADMIN_PATH}/page`,
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
                type: "ClinicAdmin" as const,
                id,
              })),
              { type: "ClinicAdmin", id: "LIST" },
            ]
          : [{ type: "ClinicAdmin", id: "LIST" }],
    }),

    getClinicAdmin: builder.query<ClinicAdminResponse, UUID>({
      query: clinicAdminId => ({
        url: `${CLINIC_ADMIN_PATH}/${clinicAdminId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "ClinicAdmin" as const, id },
      ],
    }),

    addClinicAdmin: builder.mutation<ClinicAdminResponse, ClinicAdminRequest>({
      query: clinicAdmin => ({
        url: CLINIC_ADMIN_PATH,
        method: "POST",
        body: clinicAdmin,
      }),
      invalidatesTags: [{ type: "ClinicAdmin" as const, id: "LIST" }],
    }),

    updateClinicAdmin: builder.mutation<
      ClinicAdminResponse,
      { id: UUID; clinic: ClinicAdminRequest }
    >({
      query: params => ({
        url: `${CLINIC_ADMIN_PATH}/${params.id}`,
        method: "PUT",
        body: params.clinic,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ClinicAdmin" as const, id },
        { type: "ClinicAdmin" as const, id: "LIST" },
      ],
    }),

    deleteClinicAdmin: builder.mutation<null, UUID>({
      query: clinicAdminId => ({
        url: `${CLINIC_ADMIN_PATH}/${clinicAdminId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "ClinicAdmin" as const, id },
        { type: "ClinicAdmin" as const, id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetAllClinicAdminsQuery,
  useGetClinicAdminQuery,
  useAddClinicAdminMutation,
  useUpdateClinicAdminMutation,
  useDeleteClinicAdminMutation,
} = clinicAdminApi
