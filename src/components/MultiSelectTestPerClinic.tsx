import { MultiSelect, type MultiSelectProps } from "primereact/multiselect"
import { useGetClinicQuery } from "../redux"

function MultiSelectTestPerClinic(props: MultiSelectProps) {
  const storeOption = localStorage.getItem("choosen_clinic")
  const idClinic = storeOption ? (JSON.parse(storeOption) as number) : 0

  const { data: clinicData, isLoading: isLoadingClinic } =
    useGetClinicQuery(idClinic)

  return (
    <MultiSelect
      {...props}
      options={clinicData?.medicalTests.map(speciality => ({
        label: speciality.name,
        value: speciality.id,
      }))}
    />
  )
}

export default MultiSelectTestPerClinic
