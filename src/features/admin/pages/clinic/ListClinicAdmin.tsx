import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { InputText } from "primereact/inputtext"
import { useClinicAdminHook } from "../../hooks/ClinicAdminHook"
import type { ClinicAdminResponse } from "../../types/ClinicAdmin"
import CreateClinicAdmin from "./CreateClnicAdmin"
import DeleteClinicAdmin from "./DeleteClinicAdmin"
import UpdateClinicAdmin from "./UpdateClinicAdmin"

function ListClinicAdmin() {
  const {
    page,
    pageSize,
    data,
    isLoading,
    isFetching,
    openUpdateDialog,
    openDeleteDialog,
    openCreateDialog,
    handlePageChange,
    handleSearch,
  } = useClinicAdminHook()

  const renderHeader = () => (
    <div className="flex flex-col md:flex-row gap-3 w-full">
      <div className="w-full flex justify-start items-center mb-3 md:mb-0">
        <h2 className="text-xl md:text-2xl font-semibold uppercase">
          Lista de Administradores
        </h2>
      </div>
      <div className="w-full flex flex-col sm:flex-row justify-start md:justify-end items-center gap-3 md:gap-8">
        <IconField iconPosition="left" className="w-full sm:w-auto">
          <InputIcon className="pi pi-search"></InputIcon>
          <InputText
            className="w-full"
            placeholder="Buscar administrador"
            onChange={handleSearch}
          />
        </IconField>
        <Button
          onClick={openCreateDialog}
          icon="pi pi-plus"
          className="w-full sm:w-auto md:px-4 md:min-w-[3rem]"
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
      <CreateClinicAdmin />
      <UpdateClinicAdmin />
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
