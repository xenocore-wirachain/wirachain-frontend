import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { InputText } from "primereact/inputtext"
import { classNames } from "primereact/utils"
import { Controller } from "react-hook-form"
import { useSpecialityHook } from "../../hooks/SpecialityHook"

function CreateSpecialty() {
  const {
    control,
    errors,
    isCreating,
    handleCloseForm,
    handleFormSubmitCreate,
    showCreateDialog,
  } = useSpecialityHook()

  const renderFooter = () => (
    <>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        outlined
        onClick={handleCloseForm}
        disabled={isCreating}
      />
      <Button
        type="submit"
        form="createSpecialityForm"
        label="Guardar"
        icon="pi pi-check"
        loading={isCreating}
      />
    </>
  )

  return (
    <>
      <Dialog
        header="Crear una especialidad"
        footer={renderFooter()}
        visible={showCreateDialog}
        onHide={handleCloseForm}
        className="w-xl"
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        closable={!isCreating}
      >
        <form
          id="createSpecialityForm"
          onSubmit={handleFormSubmitCreate}
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
                    disabled={isCreating}
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

export default CreateSpecialty
