import { Badge } from "primereact/badge"
import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { InputText } from "primereact/inputtext"
import { Tooltip } from "primereact/tooltip"
import { useClinicPatientHook } from "../../hooks/ClinicPatientHook"
import type { ClinicPatientResponse } from "../../utils/ClinicPatient"

function ListClinic() {
  const {
    page,
    pageSize,
    data,
    isLoading,
    isFetching,
    handlePageChange,
    handleSearch,
    handleCreateSubmit,
  } = useClinicPatientHook()

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
      </div>
    </div>
  )

  const renderState = (rowData: ClinicPatientResponse) => (
    <>
      <Tooltip target=".custom-target-icon" />
      <i
        className="custom-target-icon pi pi-envelope p-text-secondary p-overlay-badge"
        data-pr-tooltip={rowData.isRequired ? "Se sugiere activar" : undefined}
        data-pr-position="right"
        data-pr-at="right+5 top"
        data-pr-my="left center-2"
        style={{ fontSize: "1rem", cursor: "pointer" }}
      >
        {rowData.isRequired && <Badge severity="danger"></Badge>}
      </i>
    </>
  )

  const renderActionButtons = (rowData: ClinicPatientResponse) => {
    return (
      <>
        {rowData.isActive ? (
          <Button
            text
            icon="pi pi-lock-open"
            onClick={() => {
              console.log("eliminar")
            }}
            className="mr-2"
            tooltipOptions={{ position: "top" }}
            size="small"
          />
        ) : (
          <Button
            text
            onClick={() => {
              handleCreateSubmit(rowData.id)
            }}
            icon="pi pi-lock"
            className="mr-2"
            tooltipOptions={{ position: "top" }}
            size="small"
          />
        )}
      </>
    )
  }

  return (
    <div className="card">
      <DataTable
        lazy
        paginator
        value={data?.results}
        first={page * pageSize - 1}
        rows={pageSize}
        totalRecords={data?.count}
        loading={isLoading || isFetching}
        header={renderHeader()}
        onPage={handlePageChange}
        emptyMessage="No se encontraron clinicas"
        className="p-datatable-gridlines"
      >
        <Column field="name" header="Name" style={{ width: "40%" }} />
        <Column field="ruc" header="RUC" style={{ width: "40%" }} />
        <Column
          body={renderState}
          header="Estado"
          style={{ width: "10%", textAlign: "center" }}
          exportable={false}
        />
        <Column
          body={renderActionButtons}
          header="Acceso"
          style={{ width: "10%", textAlign: "center" }}
          exportable={false}
        />
      </DataTable>
    </div>
  )
}

export default ListClinic
