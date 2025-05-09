import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { InputText } from "primereact/inputtext"
import { classNames } from "primereact/utils"
import { useEffect } from "react"
import { Controller } from "react-hook-form"
import { useSpecialityHook } from "../../hooks/SpecialityHook"

function UpdateSpeciality() {
  const {
    isLoadingSpeciality,
    showUpdateDialog,
    handleCloseForm,
    handleFormSubmitUpdate,
    control,
    errors,
    handleReceiveData,
    specialityData,
    isUpdating,
  } = useSpecialityHook()

  useEffect(() => {
    if (showUpdateDialog && specialityData) {
      handleReceiveData()
    }
  }, [handleReceiveData, showUpdateDialog, specialityData])

  const renderFooter = () => (
    <>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        outlined
        onClick={handleCloseForm}
        disabled={isLoadingSpeciality || isUpdating}
      />
      <Button
        type="submit"
        form="updateSpecialityForm"
        label="Guardar"
        icon="pi pi-check"
        loading={isLoadingSpeciality || isUpdating}
      />
    </>
  )

  return (
    <>
      <Dialog
        header="Actualizar una especialidad"
        footer={renderFooter()}
        visible={showUpdateDialog}
        onHide={handleCloseForm}
        className="w-xl"
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        closable={!(isLoadingSpeciality || isUpdating)}
      >
        <form
          id="updateSpecialityForm"
          onSubmit={handleFormSubmitUpdate}
          className="p-fluid"
        >
          {/* NOMBRE */}
          <div className="field mt-4" key="firstName">
            <span className="p-float-label">
              <Controller
                name="name"
                control={control}
                rules={{ required: "Se requiere nombre" }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <InputText
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    keyfilter="alpha"
                    invalid={errors.name ? true : false}
                    disabled={isLoadingSpeciality || isUpdating}
                  />
                )}
              />
              <label
                htmlFor="firstNmae"
                className={classNames({ "p-error": errors.name })}
              >
                Nombre*
              </label>
            </span>
            {errors.name && (
              <small className="p-error">
                {errors.name.message?.toString()}
              </small>
            )}
          </div>
        </form>
      </Dialog>
    </>
  )
}

export default UpdateSpeciality
