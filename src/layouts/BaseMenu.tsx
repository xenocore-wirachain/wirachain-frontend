import { Button } from "primereact/button"
import { Menu } from "primereact/menu"
import { Menubar } from "primereact/menubar"
import type { MenuItem } from "primereact/menuitem"
import { useRef } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "../features/auth/hooks/UseAuth"
import { logout, useAppDispatch } from "../redux"
import { USER_TYPES } from "../utils/StaticVariables"

function BaseMenu() {
  const navigate = useNavigate()
  const profileMenu = useRef<Menu>(null)
  const dispatch = useAppDispatch()
  const { userType } = useAuth()

  const MenuAdmin: MenuItem[] = [
    {
      label: "Administradores de clinicas",
      icon: "pi pi-users",
      command: () => void navigate("admin/clinic-admin-list"),
    },
    {
      label: "Estudios",
      icon: "pi pi-file-plus",
      command: () => void navigate("admin/speciality-list"),
    },
    {
      label: "Especialidades",
      icon: "pi pi-bullseye",
      command: () => void navigate("admin/study-list"),
    },
  ]

  const MenuClinic: MenuItem[] = [
    {
      label: "Clinic",
      icon: "pi pi-users",
      command: () => void navigate("clinic/clinic-list"),
    },
    {
      label: "Doctores",
      icon: "pi pi-users",
      command: () => void navigate("clinic/doctor-list"),
    },
    {
      label: "Consultas",
      icon: "pi pi-clipboard",
      command: () => void navigate("history-clinic/history-appointment"),
    },
    {
      label: "Estadisticas",
      icon: "pi pi-chart-pie",
      command: () => void navigate("clinic/stadistics"),
    },
  ]

  const MenuDoctor: MenuItem[] = [
    {
      label: "Consultas",
      icon: "pi pi-clipboard",
      command: () => void navigate("doctor/appointment-list"),
    },
    {
      label: "Pacientes",
      icon: "pi pi-users",
      command: () => void navigate("doctor/patient-list"),
    },
  ]

  const MenuPatient: MenuItem[] = [
    {
      label: "Consultas",
      icon: "pi pi-clipboard",
      command: () => void navigate("patient/appointment-list"),
    },
    {
      label: "Clinicas",
      icon: "pi pi-building",
      command: () => void navigate("patient/clinic-list"),
    },
  ]

  const profileItems: MenuItem[] = [
    {
      label: "Settings",
      icon: "pi pi-cog",
      command: () => {
        switch (userType) {
          case USER_TYPES.ADMIN:
            void navigate("admin/profile")
            break
          case USER_TYPES.DOCTOR:
            void navigate("doctor/profile")
            break
          case USER_TYPES.PATIENT:
            void navigate("patient/profile")
            break
          case USER_TYPES.CLINIC:
            void navigate("clinic/profile")
            break
          default:
            break
        }
      },
    },
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      command: () => {
        dispatch(logout())
      },
    },
  ]

  const end = (
    <div className="flex flex-wrap align-items-center">
      <Menu model={profileItems} popup ref={profileMenu} />
      <Button
        icon="pi pi-user"
        // className="m-1 p-1 text-gray-700 hover:bg-gray-200 border-gray"
        className="m-1 p-1"
        severity="secondary"
        text
        onClick={event => profileMenu.current?.toggle(event)}
        aria-controls="profile-menu"
        aria-haspopup
      />
    </div>
  )

  switch (userType) {
    case USER_TYPES.ADMIN:
      return <Menubar model={MenuAdmin} end={end} />
    case USER_TYPES.DOCTOR:
      return <Menubar model={MenuDoctor} end={end} />
    case USER_TYPES.PATIENT:
      return <Menubar model={MenuPatient} end={end} />
    case USER_TYPES.CLINIC:
      return <Menubar model={MenuClinic} end={end} />
    default:
      return <Menubar model={[]} end={end} />
  }
}

export default BaseMenu
