import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Divider } from "primereact/divider"
import { InputText } from "primereact/inputtext"
import { Password } from "primereact/password"
import { Controller, useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import {
  setCredentials,
  useAppDispatch,
  useLoginMutation,
} from "../../../redux"
import type { LoginRequest } from "../types/Credentials"

function Login() {
  const defaultValues: LoginRequest = {
    email: "",
    password: "",
  }
  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<LoginRequest>({ defaultValues })
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [login, { isLoading }] = useLoginMutation()

  const onSubmit = (data: LoginRequest) => {
    console.log("CREDENTIALS", data)
    // ADMIN CREDENTIALS
    // dispatch(
    //   setCredentials({
    //     accessToken:
    //       "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibmFtZSI6IkpvYW8iLCJ1c2VyX3R5cGUiOjEsImV4cCI6MTc0Njc5NTgxNywidHlwZSI6ImFjY2VzcyJ9.LU1EGlj8KeciYEMHgu7GFk-kiJ_c7HJCb5utgRORrW0",
    //     refreshToken:
    //       "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibmFtZSI6IkpvYW8iLCJ1c2VyX3R5cGUiOjEsImV4cCI6MTc0NzM5OTcxNywidHlwZSI6InJlZnJlc2gifQ.Oa97wxEEMe4JDYfVcYikFQWWV1hAlr-7eCKCafsa7a4",
    //   }),
    // )
    // CLINIC CREDENTIALS
    dispatch(
      setCredentials({
        accessToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibmFtZSI6IkpvYW8iLCJ1c2VyX3R5cGUiOjQsImV4cCI6MTc0NjkwNTQyOCwidHlwZSI6ImFjY2VzcyJ9.lpAWbsIYddVg6wvRGM9o2djIAzp1bWcqTtfronEbTcc",
        refreshToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibmFtZSI6IkpvYW8iLCJ1c2VyX3R5cGUiOjQsImV4cCI6MTc0NzUwOTMyOCwidHlwZSI6InJlZnJlc2gifQ.dUGWBgvuxVSW3cdz-Ks4DPfRiyHhdnZe8KprpGOGk3w",
      }),
    )
    reset()
    void navigate("dashboard")
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void handleSubmit(onSubmit)(e as React.BaseSyntheticEvent)
  }

  const handleRedirectRegister = () => {
    void navigate("/register")
  }

  const handleRedirectRestore = () => {
    void navigate("/reset-pass")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-4 shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Bienvenido</h1>
          <p className="text-gray-600 mt-2">Inicia sesión para continuar</p>
        </div>

        <form id="register" onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Correo
            </label>
            <Controller
              control={control}
              name="email"
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
                  invalid={errors.email ? true : false}
                  disabled={isLoading}
                  placeholder="Ingrese su correo"
                  className="w-full p-inputtext-lg"
                />
              )}
            />
            {errors.email && (
              <small className="text-red-500">
                {errors.email.message?.toString()}
              </small>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Contraseña
            </label>
            <Controller
              control={control}
              name="password"
              rules={{ required: "Se requiere contraseña" }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Password
                  toggleMask
                  feedback={false}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                  ref={ref}
                  invalid={errors.password ? true : false}
                  placeholder="Ingrese su contraseña"
                  inputClassName="w-full p-inputtext-lg"
                  disabled={isLoading}
                />
              )}
            />
            {errors.password && (
              <small className="text-red-500">
                {errors.password.message?.toString()}
              </small>
            )}
          </div>

          <Button
            label="Iniciar sesión"
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
            size="large"
            type="submit"
            form="register"
            disabled={isLoading}
          />
        </form>

        <Divider align="center">
          <span className="text-gray-500 px-2">o</span>
        </Divider>

        <Button
          label="Registrate"
          className="w-full p-button-outlined mt-2"
          size="large"
          type="button"
          onClick={handleRedirectRegister}
        />

        <div className="flex justify-center mt-8 text-sm">
          <a
            onClick={handleRedirectRestore}
            className="text-blue-600 hover:text-blue-800"
          >
            Recupera tu contraseña
          </a>
        </div>
      </Card>
    </div>
  )
}

export default Login
