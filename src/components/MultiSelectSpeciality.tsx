import type { MultiSelectProps } from "primereact/multiselect"
import { MultiSelect } from "primereact/multiselect"
import type { VirtualScrollerLazyEvent } from "primereact/virtualscroller"
import { useEffect, useState } from "react"
import type { SpecialityResponse } from "../features/admin/types/Speciality"
import { useGetAllSpecialitiesQuery } from "../redux"

function MultiSelectSpeciality(props: MultiSelectProps) {
  const [page, setPage] = useState<number>(1)
  const [specialityData, setSpecialityData] = useState<SpecialityResponse[]>([])
  const [loadingSpeciality, setLoadingSpeciality] = useState<boolean>(false)
  const [search, setSearch] = useState<string>("")
  const [hasMoreData, setHasMoreData] = useState<boolean>(true)

  const { data, isFetching } = useGetAllSpecialitiesQuery({
    page: page,
    pageSize: 10,
    search: search,
  })

  useEffect(() => {
    if (data?.results) {
      if (data.results.length === 0 || data.results.length < 10) {
        setHasMoreData(false)
      }

      setSpecialityData(prevData => {
        const newData = data.results.filter(
          clinic => !prevData.some(existing => existing.id === clinic.id),
        )
        return [...prevData, ...newData]
      })
    }
    setLoadingSpeciality(isFetching)
  }, [data, isFetching])

  function onLazyLoad(event: VirtualScrollerLazyEvent): void {
    if (
      event.last === specialityData.length &&
      hasMoreData &&
      !loadingSpeciality
    ) {
      setPage(page + 1)
    }
  }

  return (
    <MultiSelect
      {...props}
      options={specialityData.map(speciality => ({
        label: speciality.name,
        value: speciality.id,
      }))}
      virtualScrollerOptions={{
        lazy: true,
        itemSize: 50,
        showLoader: true,
        loading: loadingSpeciality,
        onLazyLoad: onLazyLoad,
        step: 10,
      }}
    />
  )
}

export default MultiSelectSpeciality
