import type { ClinicAdminRequest } from "../../../types/ClinicAdmin"
import type { MultiFuntionalForm } from "../../../types/Form"
import type { User } from "../../../types/User"

export const formClinicAdmin: MultiFuntionalForm<ClinicAdminRequest>[] = [
  {
    name: "firstName",
    label: "Nombre",
    type: "simple-text",
    rules: {
      required: "Nombre es requerido.",
    },
  },
  {
    name: "lastName",
    label: "Apellido",
    type: "simple-text",
    rules: {
      required: "Apellido es requerido.",
    },
  },
  {
    name: "gender",
    label: "Genero",
    type: "gender",
    rules: {
      required: "Genero es requerido.",
    },
  },
  {
    name: "dateOfBirth",
    label: "Fecha de nacimiento",
    type: "date",
    rules: {
      required: "Fecha es requerido.",
    },
    maxDate: new Date(),
  },
]

export const formUser: MultiFuntionalForm<User>[] = [
  {
    name: "name",
    label: "Usuario",
    type: "simple-text",
    rules: {
      required: "Usuario es requerido.",
    },
  },
  {
    name: "phone",
    label: "Telefono",
    type: "phone",
    rules: {
      required: "Telefono es requerido.",
    },
  },
  {
    name: "email",
    label: "Correo",
    type: "mail",
    rules: {
      required: "Correo es requerido.",
    },
  },
  {
    name: "password",
    label: "Contraseña",
    type: "pass",
    rules: {
      required: "Contraseña es requerido.",
    },
  },
]
