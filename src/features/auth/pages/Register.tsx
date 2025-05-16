import "primeicons/primeicons.css"
import { Calendar } from "primereact/calendar"
import { Card } from "primereact/card"
import { Divider } from "primereact/divider"
import { Dropdown } from "primereact/dropdown"
import { InputMask } from "primereact/inputmask"
import { InputText } from "primereact/inputtext"
import { Password } from "primereact/password"
import "primereact/resources/primereact.min.css"
import "primereact/resources/themes/lara-light-indigo/theme.css"
import { classNames } from "primereact/utils"
import { Controller } from "react-hook-form"
import { useNavigate } from "react-router"
import { GenderDictionary } from "../../../utils/StaticVariables"
import { usePatientHook } from "../hooks/PatientHook"
import { Button } from "primereact/button"

function Register() {
  const navigate = useNavigate()
  const { control, errors, handleFormSubmitCreate, isLoading } =
    usePatientHook()

  const handleRedirectLogin = () => {
    void navigate("/")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-4 shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Registrate ahora</h1>
          <p className="text-gray-600 mt-2">
            Unetenos y accede a todas las herramientas
          </p>
        </div>

        <form
          id="register"
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
                    keyfilter="alpha"
                    invalid={errors.firstName ? true : false}
                    disabled={isLoading}
                  />
                )}
              />
              <label
                htmlFor="firstNmae"
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
          <Button
            label="Register"
            size="small"
            className="w-full  mt-2 bg-blue-600 hover:bg-blue-700"
            type="submit"
          />
        </form>

        <Divider align="center" />

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Ya tienes una cuenta?{" "}
            <a
              onClick={handleRedirectLogin}
              className="text-blue-600 hover:underline font-medium"
            >
              Inicia sesión
            </a>
          </p>
        </div>
      </Card>
    </div>
  )
}

export default Register
