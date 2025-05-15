import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { InputText } from "primereact/inputtext"
import { classNames } from "primereact/utils"
import { useEffect } from "react"
import { Controller } from "react-hook-form"
import { useClinicHook } from "../../hooks/ClinicHook"
import MultiSelectStudy from "../../../../components/MultiSelectStudy"

function UpdateClinic() {
  const {
    isLoadingClinic,
    showUpdateDialog,
    handleCloseForm,
    handleFormSubmitUpdate,
    control,
    errors,
    handleReceiveData,
    clinicData,
  } = useClinicHook()

  useEffect(() => {
    if (showUpdateDialog && clinicData) {
      handleReceiveData()
    }
  }, [clinicData, handleReceiveData, showUpdateDialog])

  const renderFooter = () => (
    <>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        outlined
        onClick={handleCloseForm}
        disabled={isLoadingClinic}
      />
      <Button
        type="submit"
        form="updateClinicForm"
        label="Guardar"
        icon="pi pi-check"
        loading={isLoadingClinic}
      />
    </>
  )

  return (
    <>
      <Dialog
        header="Actualizar una clínica"
        footer={renderFooter()}
        visible={showUpdateDialog}
        onHide={handleCloseForm}
        className="w-xl"
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        closable={!isLoadingClinic}
      >
        <form
          id="updateClinicForm"
          onSubmit={handleFormSubmitUpdate}
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
                    disabled={isLoadingClinic}
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
                    disabled={isLoadingClinic}
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
                    disabled={isLoadingClinic}
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

          {/* ESTUDIOS */}
          <div className="field mt-4" key="medicalTestIds">
            <span className="p-float-label">
              <Controller
                name="medicalTestIds"
                control={control}
                rules={{
                  required: "Se requieren estudios",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <MultiSelectStudy
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    invalid={errors.medicalTestIds ? true : false}
                    disabled={isLoadingClinic}
                    display="chip"
                    maxSelectedLabels={3}
                    showSelectAll={false}
                  />
                )}
              />
              <label
                htmlFor="clinicIds"
                className={classNames({ "p-error": errors.medicalTestIds })}
              >
                Estudios*
              </label>
            </span>
            {errors.medicalTestIds && (
              <small className="p-error">
                {errors.medicalTestIds.message?.toString()}
              </small>
            )}
          </div>
        </form>
      </Dialog>
    </>
  )
}

export default UpdateClinic
