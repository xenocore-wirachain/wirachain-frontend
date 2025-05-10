import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { InputText } from "primereact/inputtext"
import { classNames } from "primereact/utils"
import { useEffect } from "react"
import { Controller } from "react-hook-form"
import { useStudyHook } from "../../hooks/StudyHook"

function UpdateStudy() {
  const {
    isLoadingStudy,
    showUpdateDialog,
    handleCloseForm,
    handleFormSubmitUpdate,
    control,
    errors,
    handleReceiveData,
    studyData,
    isUpdating,
  } = useStudyHook()

  useEffect(() => {
    if (showUpdateDialog && studyData) {
      handleReceiveData()
    }
  }, [handleReceiveData, showUpdateDialog, studyData])

  const renderFooter = () => (
    <>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        outlined
        onClick={handleCloseForm}
        disabled={isLoadingStudy || isUpdating}
      />
      <Button
        type="submit"
        form="updateStudyForm"
        label="Guardar"
        icon="pi pi-check"
        loading={isLoadingStudy || isUpdating}
      />
    </>
  )

  return (
    <>
      <Dialog
        header="Actualizar un estudio"
        footer={renderFooter()}
        visible={showUpdateDialog}
        onHide={handleCloseForm}
        className="w-xl"
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        closable={!(isLoadingStudy || isUpdating)}
      >
        <form
          id="updateStudyForm"
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
                    disabled={isLoadingStudy || isUpdating}
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

export default UpdateStudy
