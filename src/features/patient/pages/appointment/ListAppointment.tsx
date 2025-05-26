import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { useAppointmentHook } from "../../hooks/Appointment"

function ListAppointment() {
  const { page, pageSize, data, isLoading, handlePageChange } =
    useAppointmentHook()

  const renderHeader = () => (
    <div className="flex flex-col md:flex-row gap-3 w-full">
      <div className="w-full flex justify-start items-center mb-3 md:mb-0">
        <h2 className="text-xl md:text-2xl font-semibold uppercase">
          Lista de consultas
        </h2>
      </div>
    </div>
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
        <Column field="id" header="ID" style={{ width: "30%" }} />
        <Column field="description" header="Detalle" style={{ width: "40%" }} />
        <Column
          field="consultationDate"
          header="Fecha"
          style={{ width: "30%" }}
        />
      </DataTable>
    </div>
  )
}

export default ListAppointment
