import type { MultiSelectProps } from "primereact/multiselect"
import { MultiSelect } from "primereact/multiselect"
import type { VirtualScrollerLazyEvent } from "primereact/virtualscroller"
import { useEffect, useState } from "react"
import type { StudyResponse } from "../features/admin/types/Study"
import { useGetAllSpecialitiesQuery } from "../redux"

function MultiSelectStudy(props: MultiSelectProps) {
  const [page, setPage] = useState<number>(1)
  const [studyData, setStudyData] = useState<StudyResponse[]>([])
  const [loadingStudy, setLoadingStudy] = useState<boolean>(false)
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

      setStudyData(prevData => {
        const newData = data.results.filter(
          clinic => !prevData.some(existing => existing.id === clinic.id),
        )
        return [...prevData, ...newData]
      })
    }
    setLoadingStudy(isFetching)
  }, [data, isFetching])

  function onLazyLoad(event: VirtualScrollerLazyEvent): void {
    if (event.last === studyData.length && hasMoreData && !loadingStudy) {
      setPage(page + 1)
    }
  }

  return (
    <MultiSelect
      {...props}
      options={studyData.map(study => ({
        label: study.name,
        value: study.id,
      }))}
      virtualScrollerOptions={{
        lazy: true,
        itemSize: 50,
        showLoader: true,
        loading: loadingStudy,
        onLazyLoad: onLazyLoad,
        step: 10,
      }}
    />
  )
}

export default MultiSelectStudy
