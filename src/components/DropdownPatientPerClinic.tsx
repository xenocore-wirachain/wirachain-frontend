import type { DropdownProps } from "primereact/dropdown"
import { Dropdown } from "primereact/dropdown"
import type { VirtualScrollerLazyEvent } from "primereact/virtualscroller"
import { useEffect, useState } from "react"
import type { PatientResponse } from "../features/patient/types/Patient"
import { useGetPatientsPerClinicQuery } from "../redux"

function DropdownPatientPerClinic(props: DropdownProps) {
  const [page, setPage] = useState<number>(1)
  const [patientData, setPatientdata] = useState<PatientResponse[]>([])
  const [loadingPatient, setLoadingPatient] = useState<boolean>(false)
  const [search, setSearch] = useState<string>("")
  const [hasMoreData, setHasMoreData] = useState<boolean>(true)
  const storeOption = localStorage.getItem("choosen_clinic")
  const idClinic = storeOption ? (JSON.parse(storeOption) as number) : 0

  const { data, isFetching } = useGetPatientsPerClinicQuery({
    idClinic: idClinic,
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

      setPatientdata(prevData => {
        const newData = data.results.filter(
          patient => !prevData.some(existing => existing.id === patient.id),
        )
        return [...prevData, ...newData] as PatientResponse[]
      })
    }
    setLoadingPatient(isFetching)
  }, [data, isFetching])

  function onLazyLoad(event: VirtualScrollerLazyEvent): void {
    if (event.last === patientData.length && hasMoreData && !loadingPatient) {
      setPage(page + 1)
    }
  }

  return (
    <Dropdown
      {...props}
      options={patientData.map(patient => ({
        label: patient.firstName,
        value: patient.id,
      }))}
      virtualScrollerOptions={{
        lazy: true,
        itemSize: 50,
        showLoader: true,
        loading: loadingPatient,
        onLazyLoad: onLazyLoad,
        step: 10,
      }}
    />
  )
}

export default DropdownPatientPerClinic
