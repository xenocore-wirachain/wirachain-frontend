import { Button } from "primereact/button"
import { Calendar } from "primereact/calendar"
import { Dialog } from "primereact/dialog"
import { Dropdown } from "primereact/dropdown"
import { InputMask } from "primereact/inputmask"
import { InputText } from "primereact/inputtext"
import { Password } from "primereact/password"
import { classNames } from "primereact/utils"
import { Controller } from "react-hook-form"
import MultiSelectClinic from "../../../../components/MultiSelectClinic"
import MultiSelectSpeciality from "../../../../components/MultiSelectSpeciality"
import { GenderDictionary } from "../../../../utils/StaticVariables"
import { useDoctorHook } from "../../hooks/DoctorHook"

function CreateDoctor() {
  const {
    control,
    errors,
    isCreating,
    handleCloseForm,
    handleFormSubmitCreate,
    showCreateDialog,
  } = useDoctorHook()

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
      <Dialog
        header="Crear un doctor"
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
          <div className="field mt-4" key="firstName">
            <span className="p-float-label">
              <Controller
                name="firstName"
                control={control}
                rules={{ required: "Se requiere nombre" }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <InputText
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    invalid={errors.firstName ? true : false}
                    disabled={isCreating}
                  />
                )}
              />
              <label
                htmlFor="name"
                className={classNames({ "p-error": errors.firstName })}
              >
                Nombre*
              </label>
            </span>
            {errors.firstName && (
              <small className="p-error">
                {errors.firstName.message?.toString()}
              </small>
            )}
          </div>

          {/* APELLIDO */}
          <div className="field mt-4" key="lastName">
            <span className="p-float-label">
              <Controller
                name="lastName"
                control={control}
                rules={{ required: "Se requiere apellido" }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <InputText
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    keyfilter="alpha"
                    invalid={errors.lastName ? true : false}
                    disabled={isCreating}
                  />
                )}
              />
              <label
                htmlFor="lastName"
                className={classNames({ "p-error": errors.lastName })}
              >
                Apellido*
              </label>
            </span>
            {errors.lastName && (
              <small className="p-error">
                {errors.lastName.message?.toString()}
              </small>
            )}
          </div>

          {/* GENDER */}
          <div className="field mt-4" key="gender">
            <span className="p-float-label">
              <Controller
                name="gender"
                control={control}
                rules={{ required: "Se requiere genero" }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Dropdown
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    invalid={errors.gender ? true : false}
                    options={GenderDictionary}
                    disabled={isCreating}
                    optionLabel="value"
                  />
                )}
              />
              <label
                htmlFor="gender"
                className={classNames({ "p-error": errors.gender })}
              >
                Genero*
              </label>
            </span>
            {errors.gender && (
              <small className="p-error">
                {errors.gender.message?.toString()}
              </small>
            )}
          </div>

          {/* DATE OF BIRTH */}
          <div className="field mt-4" key="birth">
            <span className="p-float-label">
              <Controller
                name="dateOfBirth"
                control={control}
                rules={{ required: "Se requiere fecha de nacimiento" }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Calendar
                    readOnlyInput
                    onBlur={onBlur}
                    onChange={onChange}
                    value={
                      value instanceof Date || value === null ? value : null
                    }
                    ref={ref}
                    invalid={errors.dateOfBirth ? true : false}
                    maxDate={new Date()}
                    disabled={isCreating}
                  />
                )}
              />
              <label
                htmlFor="birth"
                className={classNames({ "p-error": errors.firstName })}
              >
                Fecha de nacimiento*
              </label>
            </span>
            {errors.dateOfBirth && (
              <small className="p-error">
                {errors.dateOfBirth.message?.toString()}
              </small>
            )}
          </div>

          {/* PHONE */}
          <div className="field mt-4" key="phone">
            <span className="p-float-label">
              <Controller
                name="user.phone"
                control={control}
                rules={{ required: "Se requiere telefono" }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <InputMask
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    invalid={errors.user?.phone ? true : false}
                    mask="999-999-999"
                    placeholder="000-000-000"
                    disabled={isCreating}
                  />
                )}
              />
              <label
                htmlFor="phone"
                className={classNames({ "p-error": errors.user?.phone })}
              >
                Telefono*
              </label>
            </span>
            {errors.user?.phone && (
              <small className="p-error">
                {errors.user.phone.message?.toString()}
              </small>
            )}
          </div>

          {/* CLINICS */}
          <div className="field mt-4" key="clinicIds">
            <span className="p-float-label">
              <Controller
                name="clinicIds"
                control={control}
                rules={{
                  required: "Se requiere clinicas",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <MultiSelectClinic
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    invalid={errors.clinicIds ? true : false}
                    disabled={isCreating}
                    display="chip"
                    maxSelectedLabels={3}
                    showSelectAll={false}
                  />
                )}
              />
              <label
                htmlFor="clinicIds"
                className={classNames({ "p-error": errors.clinicIds })}
              >
                Clinicas*
              </label>
            </span>
            {errors.clinicIds && (
              <small className="p-error">
                {errors.clinicIds.message?.toString()}
              </small>
            )}
          </div>

          {/* ESPECIALIDAD */}
          <div className="field mt-4" key="medicalSpecialtyIds">
            <span className="p-float-label">
              <Controller
                name="medicalSpecialtyIds"
                control={control}
                rules={{
                  required: "Se requiere especialidades",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <MultiSelectSpeciality
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    invalid={errors.medicalSpecialtyIds ? true : false}
                    disabled={isCreating}
                    display="chip"
                    maxSelectedLabels={3}
                    showSelectAll={false}
                  />
                )}
              />
              <label
                htmlFor="medicalSpecialtyIds"
                className={classNames({
                  "p-error": errors.medicalSpecialtyIds,
                })}
              >
                Especialidades*
              </label>
            </span>
            {errors.medicalSpecialtyIds && (
              <small className="p-error">
                {errors.medicalSpecialtyIds.message?.toString()}
              </small>
            )}
          </div>

          {/* EMAIL */}
          <div className="field mt-4" key="mail">
            <span className="p-float-label">
              <Controller
                name="user.email"
                control={control}
                rules={{
                  required: "Se requiere correo",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Correo invalido",
                  },
                }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <InputText
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    keyfilter="email"
                    invalid={errors.user?.email ? true : false}
                    disabled={isCreating}
                  />
                )}
              />
              <label
                htmlFor="mail"
                className={classNames({ "p-error": errors.user?.email })}
              >
                Correo*
              </label>
            </span>
            {errors.user?.email && (
              <small className="p-error">
                {errors.user.email.message?.toString()}
              </small>
            )}
          </div>

          {/* PASSWORD */}
          <div className="field mt-4" key="password">
            <span className="p-float-label">
              <Controller
                name="user.password"
                control={control}
                rules={{ required: "Se requiere contraseña" }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Password
                    toggleMask
                    feedback={false}
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    invalid={errors.user?.password ? true : false}
                    disabled={isCreating}
                  />
                )}
              />
              <label
                htmlFor="password"
                className={classNames({ "p-error": errors.user?.password })}
              >
                Contraseña*
              </label>
            </span>
            {errors.user?.password && (
              <small className="p-error">
                {errors.user.password.message?.toString()}
              </small>
            )}
          </div>
        </form>
      </Dialog>
    </>
  )
}

export default CreateDoctor
