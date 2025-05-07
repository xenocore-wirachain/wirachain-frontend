import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
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
    <div className="flex flex-col md:flex-row gap-3 w-full">
      <div className="w-full flex justify-start items-center mb-3 md:mb-0">
        <h2 className="text-xl md:text-2xl font-semibold uppercase">
          Lista de Clinicas
        </h2>
      </div>
      <div className="w-full flex flex-col sm:flex-row justify-start md:justify-end items-center gap-3 md:gap-8">
        <IconField iconPosition="left" className="w-full sm:w-auto">
          <InputIcon className="pi pi-search"></InputIcon>
          <InputText
            className="w-full"
            placeholder="Buscar clinica"
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
