import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { UUID } from "crypto"
import type {
  DoctorDetailedResponse,
  DoctorRequest,
} from "../../features/clinic/types/Doctor"
import type { Pagination, PaginationParams } from "../../types/Pagination"
import { API_URL, BASE_PATH } from "../../utils/ApiPath"

const DOCTOR_PATH = BASE_PATH.doctor

export const doctorApi = createApi({
  reducerPath: "doctorApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["Doctor"],
  endpoints: builder => ({
    getAllDoctors: builder.query<
      Pagination<DoctorDetailedResponse>,
      { pagination: PaginationParams; id: UUID }
    >({
      query: params => ({
        url: `${DOCTOR_PATH}/page/admin/${params.id}`,
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
                type: "Doctor" as const,
                id,
              })),
              { type: "Doctor", id: "LIST" },
            ]
          : [{ type: "Doctor", id: "LIST" }],
    }),

    getDoctor: builder.query<DoctorDetailedResponse, UUID>({
      query: clinicAdminId => ({
        url: `${DOCTOR_PATH}/${clinicAdminId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Doctor" as const, id }],
    }),

    addDoctor: builder.mutation<DoctorDetailedResponse, DoctorRequest>({
      query: clinicAdmin => ({
        url: DOCTOR_PATH,
        method: "POST",
        body: clinicAdmin,
      }),
      invalidatesTags: [{ type: "Doctor" as const, id: "LIST" }],
    }),

    updateDoctor: builder.mutation<
      DoctorDetailedResponse,
      { id: UUID; doctor: DoctorRequest }
    >({
      query: params => ({
        url: `${DOCTOR_PATH}/${params.id}`,
        method: "PUT",
        body: params.doctor,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Doctor" as const, id },
        { type: "Doctor" as const, id: "LIST" },
      ],
    }),

    deleteDoctor: builder.mutation<null, UUID>({
      query: clinicAdminId => ({
        url: `${DOCTOR_PATH}/${clinicAdminId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Doctor" as const, id },
        { type: "Doctor" as const, id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetAllDoctorsQuery,
  useGetDoctorQuery,
  useAddDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
} = doctorApi
