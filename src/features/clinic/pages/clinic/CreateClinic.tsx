import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { InputText } from "primereact/inputtext"
import { Toast } from "primereact/toast"
import { classNames } from "primereact/utils"
import { Controller } from "react-hook-form"
import { useClinicHook } from "../../hooks/ClinicHook"

function CreateClinic() {
  const {
    toastRef,
    control,
    errors,
    isCreating,
    handleCloseForm,
    handleFormSubmitCreate,
    showCreateDialog,
  } = useClinicHook()

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
        form="createClinicForm"
        label="Guardar"
        icon="pi pi-check"
        loading={isCreating}
      />
    </>
  )

  return (
    <>
      <Toast ref={toastRef} />
      <Dialog
        header="Crear una clínica"
        footer={renderFooter()}
        visible={showCreateDialog}
        onHide={handleCloseForm}
        className="w-xl"
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        closable={!isCreating}
      >
        <form
          id="createClinicForm"
          onSubmit={handleFormSubmitCreate}
          className="p-fluid"
        >
          {/* NOMBRE */}
          <div className="field mt-4" key="name">
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
                    invalid={errors.name ? true : false}
                    disabled={isCreating}
                  />
                )}
              />
              <label
                htmlFor="name"
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

          {/* RUC */}
          <div className="field mt-4" key="ruc">
            <span className="p-float-label">
              <Controller
                name="ruc"
                control={control}
                rules={{
                  required: "Se requiere ruc",
                  validate: (value: string) => {
                    if (value.length !== 11) {
                      return "RUC debe tener 11 caracteres"
                    }
                    return true
                  },
                }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <InputText
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    invalid={errors.ruc ? true : false}
                    disabled={isCreating}
                    keyfilter="int"
                  />
                )}
              />
              <label
                htmlFor="ruc"
                className={classNames({ "p-error": errors.ruc })}
              >
                RUC*
              </label>
            </span>
            {errors.ruc && (
              <small className="p-error">
                {errors.ruc.message?.toString()}
              </small>
            )}
          </div>

          {/* ADRRESS */}
          <div className="field mt-4" key="address">
            <span className="p-float-label">
              <Controller
                name="address"
                control={control}
                rules={{ required: "Se requiere direccion" }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <InputText
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    invalid={errors.address ? true : false}
                    disabled={isCreating}
                  />
                )}
              />
              <label
                htmlFor="address"
                className={classNames({ "p-error": errors.address })}
              >
                Direccion*
              </label>
            </span>
            {errors.address && (
              <small className="p-error">
                {errors.address.message?.toString()}
              </small>
            )}
          </div>
        </form>
      </Dialog>
    </>
  )
}

export default CreateClinic
