import { Button } from "primereact/button"
import { Calendar } from "primereact/calendar"
import { Dropdown } from "primereact/dropdown"
import { InputMask } from "primereact/inputmask"
import { InputText } from "primereact/inputtext"
import { classNames } from "primereact/utils"
import { useEffect } from "react"
import { Controller } from "react-hook-form"
import { GenderDictionary } from "../../../utils/StaticVariables"
import { useClinicAdminHook } from "../hooks/ClinicAdminHook"

function Profile() {
  const {
    isLoadingAdminCLinic,
    handleFormSubmitUpdate,
    control,
    errors,
    handleReceiveData,
    clinicAdminData,
    isUpdating,
  } = useClinicAdminHook()

  useEffect(() => {
    if (clinicAdminData) {
      handleReceiveData()
    }
  }, [clinicAdminData, handleReceiveData])

  return (
    <div className="flex justify-center items-center h-full bg-gray-50 p-4">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-6 md:p-12">
        <h2 className="text-center mb-8 text-3xl font-bold text-primary">
          Mi Perfil
        </h2>
        <form
          id="updateClinicProfile"
          onSubmit={handleFormSubmitUpdate}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
          autoComplete="off"
        >
          {/* NOMBRE */}
          <div key="firstName">
            <span className="p-float-label w-full">
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
                    keyfilter="alpha"
                    className={classNames("w-full", {
                      "p-invalid": errors.firstName,
                    })}
                    disabled
                  />
                )}
              />
              <label
                htmlFor="firstName"
                className={classNames({ "p-error": errors.firstName })}
              >
                Nombre*
              </label>
            </span>
            {errors.firstName && (
              <small className="p-error block">
                {errors.firstName.message?.toString()}
              </small>
            )}
          </div>

          {/* APELLIDO */}
          <div key="lastName">
            <span className="p-float-label w-full">
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
                    className={classNames("w-full", {
                      "p-invalid": errors.lastName,
                    })}
                    disabled
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
              <small className="p-error block">
                {errors.lastName.message?.toString()}
              </small>
            )}
          </div>

          {/* GENDER */}
          <div key="gender">
            <span className="p-float-label w-full">
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
                    className={classNames("w-full", {
                      "p-invalid": errors.gender,
                    })}
                    options={GenderDictionary}
                    optionLabel="value"
                    disabled
                  />
                )}
              />
              <label
                htmlFor="gender"
                className={classNames({ "p-error": errors.gender })}
              >
                Género*
              </label>
            </span>
            {errors.gender && (
              <small className="p-error block">
                {errors.gender.message?.toString()}
              </small>
            )}
          </div>

          {/* DATE OF BIRTH */}
          <div key="birth">
            <span className="p-float-label w-full">
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
                    className={classNames("w-full", {
                      "p-invalid": errors.dateOfBirth,
                    })}
                    maxDate={new Date()}
                    disabled
                  />
                )}
              />
              <label
                htmlFor="birth"
                className={classNames({ "p-error": errors.dateOfBirth })}
              >
                Fecha de nacimiento*
              </label>
            </span>
            {errors.dateOfBirth && (
              <small className="p-error block">
                {errors.dateOfBirth.message?.toString()}
              </small>
            )}
          </div>

          {/* PHONE */}
          <div key="phone">
            <span className="p-float-label w-full">
              <Controller
                name="user.phone"
                control={control}
                rules={{ required: "Se requiere teléfono" }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <InputMask
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    className={classNames("w-full", {
                      "p-invalid": errors.user?.phone,
                    })}
                    mask="999-999-999"
                    disabled={isLoadingAdminCLinic || isUpdating}
                  />
                )}
              />
              <label
                htmlFor="phone"
                className={classNames({ "p-error": errors.user?.phone })}
              >
                Teléfono*
              </label>
            </span>
            {errors.user?.phone && (
              <small className="p-error block">
                {errors.user.phone.message?.toString()}
              </small>
            )}
          </div>

          {/* EMAIL */}
          <div key="mail">
            <span className="p-float-label w-full">
              <Controller
                name="user.email"
                control={control}
                rules={{
                  required: "Se requiere correo",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Correo inválido",
                  },
                }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <InputText
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    keyfilter="email"
                    className={classNames("w-full", {
                      "p-invalid": errors.user?.email,
                    })}
                    disabled={isLoadingAdminCLinic || isUpdating}
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
              <small className="p-error block">
                {errors.user.email.message?.toString()}
              </small>
            )}
          </div>

          {/* BUTTON */}
          <div className="col-span-1 md:col-span-2 mt-8 flex justify-center">
            <Button
              type="submit"
              form="updateClinicProfile"
              label={isUpdating ? "Guardando..." : "Guardar cambios"}
              className="w-full md:w-1/3"
              icon={isUpdating ? "pi pi-spin pi-spinner" : "pi pi-save"}
              loading={isUpdating}
              disabled={isLoadingAdminCLinic || isUpdating}
              severity="info"
              size="large"
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile
