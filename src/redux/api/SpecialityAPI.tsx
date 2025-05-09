import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type {
  SpecialityRequest,
  SpecialityResponse,
} from "../../features/admin/types/Speciality"
import type { Pagination, PaginationParams } from "../../types/Pagination"
import { API_URL, BASE_PATH } from "../../utils/ApiPath"

const SPECIALITY_PATH = BASE_PATH.speciality

export const specialityApi = createApi({
  reducerPath: "specialityApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["Speciality"],
  endpoints: builder => ({
    getAllSpecialities: builder.query<
      Pagination<SpecialityResponse>,
      PaginationParams
    >({
      query: ({ page, pageSize, search }) => ({
        url: `${SPECIALITY_PATH}/page`,
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
                type: "Speciality" as const,
                id,
              })),
              { type: "Speciality", id: "LIST" },
            ]
          : [{ type: "Speciality", id: "LIST" }],
    }),

    getSpeciality: builder.query<SpecialityResponse, number>({
      query: specialityId => ({
        url: `${SPECIALITY_PATH}/${specialityId.toString()}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "Speciality" as const, id },
      ],
    }),

    addSpeciality: builder.mutation<SpecialityResponse, SpecialityRequest>({
      query: speciality => ({
        url: SPECIALITY_PATH,
        method: "POST",
        body: speciality,
      }),
      invalidatesTags: [{ type: "Speciality" as const, id: "LIST" }],
    }),

    updateSpeciality: builder.mutation<
      SpecialityResponse,
      { id: number; speciality: SpecialityRequest }
    >({
      query: params => ({
        url: `${SPECIALITY_PATH}/${params.id.toString()}`,
        method: "PUT",
        body: params.speciality,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Speciality" as const, id },
        { type: "Speciality" as const, id: "LIST" },
      ],
    }),

    deleteSpeciality: builder.mutation<null, number>({
      query: specialityId => ({
        url: `${SPECIALITY_PATH}/${specialityId.toString()}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Speciality" as const, id },
        { type: "Speciality" as const, id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetAllSpecialitiesQuery,
  useGetSpecialityQuery,
  useAddSpecialityMutation,
  useUpdateSpecialityMutation,
  useDeleteSpecialityMutation,
} = specialityApi
