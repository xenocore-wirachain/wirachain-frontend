import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { InputText } from "primereact/inputtext"
import { Toast } from "primereact/toast"
import { useClinicHook } from "../../hooks/ClinicHook"
import type { ClinicResponse } from "../../types/Clinic"
import CreateClinic from "./CreateClinic"
import DeleteClinic from "./DeleteClinic"
import UpdateClinic from "./UpdateClinic"

function ListClinic() {
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
  } = useClinicHook()

  const renderHeader = () => (
    <div className="flex flex-wrap justify-between items-center">
      <h2 className="text-2xl font-semibold">Lista de Clinicas</h2>
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

  const renderActionButtons = (rowData: ClinicResponse) => (
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
      <CreateClinic />
      <UpdateClinic />
      <DeleteClinic />
      <DataTable
        lazy
        paginator
        value={data?.results}
        first={page * pageSize}
        rows={pageSize}
        totalRecords={data?.count}
        loading={isLoading || isFetching}
        header={renderHeader()}
        onPage={handlePageChange}
        emptyMessage="No se encontraron clinicas"
        className="p-datatable-gridlines"
      >
        <Column field="id" header="ID" style={{ width: "30%" }} />
        <Column field="ruc" header="RUC" style={{ width: "30%" }} />
        <Column field="name" header="Name" style={{ width: "30%" }} />
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

export default ListClinic
