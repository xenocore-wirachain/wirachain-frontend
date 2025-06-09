import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { InputText } from "primereact/inputtext"
import { useNavigate } from "react-router"
import type { MedicalConsultationResponseDoctorAndClinic } from "../../../../types/MedicalConsultation"
import { useAppointmentListHook } from "../../hooks/AppointmentListHook"

function HistoryAppoinment() {
  const { page, pageSize, handlePageChange, handleSearch, data, isLoading } =
    useAppointmentListHook()
  const navigate = useNavigate()

  const renderHeader = () => (
    <div className="flex flex-col md:flex-row gap-3 w-full">
      <div className="w-full flex justify-start items-center mb-3 md:mb-0">
        <h2 className="text-xl md:text-2xl font-semibold uppercase">
          Lista de Consultas
        </h2>
      </div>
      <div className="w-full flex flex-col sm:flex-row justify-start md:justify-end items-center gap-3 md:gap-8">
        <IconField iconPosition="left" className="w-full sm:w-auto">
          <InputIcon className="pi pi-search"></InputIcon>
          <InputText
            className="w-full"
            placeholder="Buscar consulta"
            onChange={handleSearch}
          />
        </IconField>
      </div>
    </div>
  )

  const renderActionButtons = (
    rowData: MedicalConsultationResponseDoctorAndClinic,
  ) => (
    <>
      <Button
        text
        onClick={() => {
          void navigate(`/dashboard/clinic/history-appointment/${rowData.id}`)
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
        value={data?.results}
        first={page * pageSize - 1}
        rows={pageSize}
        totalRecords={data?.count}
        loading={isLoading}
        header={renderHeader()}
        onPage={handlePageChange}
        emptyMessage="No se encontraron consultas"
        className="p-datatable-gridlines"
      >
        <Column
          field="description"
          header="Descripcion"
          style={{ width: "70%" }}
        />
        <Column
          field="consultationDate"
          header="Fecha"
          style={{ width: "20%" }}
        />
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

export default HistoryAppoinment
