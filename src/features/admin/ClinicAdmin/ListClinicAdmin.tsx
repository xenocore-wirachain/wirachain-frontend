import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { InputText } from "primereact/inputtext"
import { Toast } from "primereact/toast"
import { useClinicAdminHook } from "../../../hooks/ClinicAdminHook"
import type { ClinicAdminResponse } from "../../../types/ClinicAdmin"
import CreateClinicAdmin from "./CreateClnicAdmin"
import DeleteClinicAdmin from "./DeleteClinicAdmin"

function ListClinicAdmin() {
  const {
    page,
    pageSize,
    data,
    isLoading,
    isFetching,
    toastRef,
    openUpdateDialog,
    openDeleteDialog,
    openCreateDialog,
    handlePageChange,
    handleSearch,
  } = useClinicAdminHook()

  const renderHeader = () => (
    <div className="flex flex-wrap justify-between items-center">
      <h2 className="text-2xl font-semibold">Lista de Administradores</h2>
      <div className="flex flex-wrap items-center gap-3">
        <InputText placeholder="Buscar" onChange={handleSearch} />
        <Button
          onClick={openCreateDialog}
          icon="pi pi-plus"
          label="Nuevo"
          severity="success"
          raised
        />
      </div>
    </div>
  )

  const renderActionButtons = (rowData: ClinicAdminResponse) => (
    <>
      <Button
        text
        onClick={() => {
          openUpdateDialog(rowData.id)
        }}
        icon="pi pi-pencil"
        className="mr-2"
        tooltip="Editar"
        tooltipOptions={{ position: "top" }}
        size="small"
      />
      <Button
        text
        onClick={() => {
          openDeleteDialog(rowData.id)
        }}
        icon="pi pi-trash"
        severity="danger"
        tooltip="Eliminar"
        tooltipOptions={{ position: "top" }}
        size="small"
      />
    </>
  )

  return (
    <div className="card">
      <Toast ref={toastRef} />
      <CreateClinicAdmin />
      <DeleteClinicAdmin />
      <DataTable
        lazy
        paginator
        scrollable
        value={data?.results}
        first={page * pageSize - 1}
        rows={pageSize}
        totalRecords={data?.count}
        loading={isLoading || isFetching}
        header={renderHeader()}
        onPage={handlePageChange}
        emptyMessage="No se encontraron administradores"
        className="p-datatable-gridlines"
      >
        <Column field="id" header="ID" style={{ width: "30%" }} />
        <Column field="firstName" header="Nombre" style={{ width: "30%" }} />
        <Column field="lastName" header="Apellido" style={{ width: "30%" }} />
        <Column
          body={renderActionButtons}
          style={{ width: "10%", textAlign: "center" }}
          exportable={false}
        />
      </DataTable>
    </div>
  )
}

export default ListClinicAdmin
