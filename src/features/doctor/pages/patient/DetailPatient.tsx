import type { UUID } from "crypto"
import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { useNavigate, useParams } from "react-router"
import type { MedicalConsultationResponseDoctorAndClinic } from "../../../../types/MedicalConsultation"
import { usePatientDetailHook } from "../../hooks/PatientDetailHook"

function DetailPatient() {
  const { idPatient } = useParams()
  const { page, pageSize, data, isLoading, handlePageChange } =
    usePatientDetailHook(idPatient as UUID)
  const navigate = useNavigate()

  const renderHeader = () => (
    <div className="flex flex-col md:flex-row gap-3 w-full">
      <div className="w-full flex justify-start items-center mb-3 md:mb-0">
        <h2 className="text-xl md:text-2xl font-semibold uppercase">
          Lista de consultas segun paciente
        </h2>
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
          void navigate(`/dashboard/doctor/appointment-list/${rowData.id}`)
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
        emptyMessage="No se encontraron consultas medicas"
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

export default DetailPatient
