import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { InputText } from "primereact/inputtext"
import { useNavigate } from "react-router"
import type { PatientResponse } from "../../../patient/types/Patient"
import { usePatientHook } from "../../hooks/PatientHook"

function ListPatient() {
  const {
    page,
    pageSize,
    handlePageChange,
    handleSearch,
    patientData,
    isLoadingPatient,
  } = usePatientHook()
  const navigate = useNavigate()

  const renderHeader = () => (
    <div className="flex flex-col md:flex-row gap-3 w-full">
      <div className="w-full flex justify-start items-center mb-3 md:mb-0">
        <h2 className="text-xl md:text-2xl font-semibold uppercase">
          Lista de pacientes segun clinica
        </h2>
      </div>
      <div className="w-full flex flex-col sm:flex-row justify-start md:justify-end items-center gap-3 md:gap-8">
        <IconField iconPosition="left" className="w-full sm:w-auto">
          <InputIcon className="pi pi-search"></InputIcon>
          <InputText
            className="w-full"
            placeholder="Buscar paciente"
            onChange={handleSearch}
          />
        </IconField>
        <Button
          onClick={() => {
            console.log("ENVIAR NOTIFICACION PACIENTE")
          }}
          icon="pi pi-plus"
          className="w-full sm:w-auto md:px-4 md:min-w-[3rem]"
        />
      </div>
    </div>
  )

  const renderActionButtons = (rowData: PatientResponse) => (
    <>
      <Button
        text
        onClick={() => {
          void navigate(`/dashboard/doctor/patient-list/${rowData.id}`)
        }}
        icon="pi pi-chevron-circle-right"
        className="mr-2"
        tooltip="Detalle"
        tooltipOptions={{ position: "top" }}
        size="small"
      />
    </>
  )

  return (
    <div className="card">
      <DataTable
        lazy
        paginator
        value={patientData?.results}
        first={page * pageSize - 1}
        rows={pageSize}
        totalRecords={patientData?.count}
        loading={isLoadingPatient}
        header={renderHeader()}
        onPage={handlePageChange}
        emptyMessage="No se encontraron clinicas"
        className="p-datatable-gridlines"
      >
        <Column field="firstName" header="Nombre" style={{ width: "45%" }} />
        <Column field="lastName" header="Apellido" style={{ width: "45%" }} />
        <Column
          body={renderActionButtons}
          header="Acciones"
          style={{ width: "10%", textAlign: "center" }}
          exportable={false}
        />
      </DataTable>
    </div>
  )
}

export default ListPatient
