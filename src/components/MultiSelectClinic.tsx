import type { MultiSelectProps } from "primereact/multiselect"
import { MultiSelect } from "primereact/multiselect"
import type { VirtualScrollerLazyEvent } from "primereact/virtualscroller"
import { useEffect, useState } from "react"
import { useAuth } from "../features/auth/hooks/UseAuth"
import type { ClinicResponse } from "../features/clinic/types/Clinic"
import { useGetAllClinicsQuery } from "../redux"

function MultiSelectClinic(props: MultiSelectProps) {
  const [page, setPage] = useState<number>(1)
  const [clinicData, setClinicData] = useState<ClinicResponse[]>([])
  const [loadingClinic, setLoadingClinic] = useState<boolean>(false)
  const [search, setSearch] = useState<string>("")
  const [hasMoreData, setHasMoreData] = useState<boolean>(true)
  const { userId } = useAuth()

  if (!userId) {
    throw new Error("User ID is required for clinic admin operations")
  }
  const idAdminClinic = userId

  const { data, isFetching } = useGetAllClinicsQuery({
    id: idAdminClinic,
    pagination: {
      page: page,
      pageSize: 10,
      search: search,
    },
  })

  useEffect(() => {
    if (data?.results) {
      if (data.results.length === 0 || data.results.length < 10) {
        setHasMoreData(false)
      }

      setClinicData(prevData => {
        const newData = data.results.filter(
          clinic => !prevData.some(existing => existing.id === clinic.id),
        )
        return [...prevData, ...newData]
      })
    }
    setLoadingClinic(isFetching)
  }, [data, isFetching])

  function onLazyLoad(event: VirtualScrollerLazyEvent): void {
    if (event.last === clinicData.length && hasMoreData && !loadingClinic) {
      setPage(page + 1)
    }
  }

  return (
    <MultiSelect
      {...props}
      options={clinicData.map(clinic => ({
        label: clinic.name,
        value: clinic.id,
      }))}
      virtualScrollerOptions={{
        lazy: true,
        itemSize: 50,
        showLoader: true,
        loading: loadingClinic,
        onLazyLoad: onLazyLoad,
        step: 10,
      }}
    />
  )
}

export default MultiSelectClinic
