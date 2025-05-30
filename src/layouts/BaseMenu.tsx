import { Button } from "primereact/button"
import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown"
import { Menu } from "primereact/menu"
import { Menubar } from "primereact/menubar"
import type { MenuItem } from "primereact/menuitem"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "../features/auth/hooks/UseAuth"
import type { ClinicData } from "../features/clinic/types/Doctor"
import { logout, useAppDispatch } from "../redux"
import { USER_TYPES } from "../utils/StaticVariables"

function BaseMenu() {
  const navigate = useNavigate()
  const profileMenu = useRef<Menu>(null)
  const dispatch = useAppDispatch()
  const { userType, userName } = useAuth()
  const [clinicOptions, setClinicOptions] = useState<ClinicData[]>([])
  const [clinicSelected, setClinicSelected] = useState<number>(0)

  useEffect(() => {
    if (userType === USER_TYPES.DOCTOR) {
      try {
        const storeClinicData = localStorage.getItem("available_clinic")
        const storeOption = localStorage.getItem("choosen_clinic")
        if (storeClinicData) {
          const clinics = JSON.parse(storeClinicData) as ClinicData[]
          setClinicOptions(clinics)
          if (storeOption) {
            const selectedId = JSON.parse(storeOption) as number
            setClinicSelected(selectedId)
          }
        }
      } catch (error) {
        console.error("Error retrieving doctor data from localStorage", error)
      }
    }
  }, [userType])

  const handleClinicChange = (e: DropdownChangeEvent) => {
    const optionChoosen = e.value as ClinicData
    setClinicSelected(optionChoosen.id)
    try {
      if (e.value) {
        localStorage.setItem("choosen_clinic", JSON.stringify(optionChoosen.id))
      }
    } catch (error) {
      console.error("Error storing selected clinic in localStorage", error)
    }
  }

  const MenuAdmin: MenuItem[] = [
    {
      label: "Administradores de clinicas",
      icon: "pi pi-users",
      command: () => void navigate("admin/clinic-admin-list"),
    },
    {
      label: "Estudios",
      icon: "pi pi-file-plus",
      command: () => void navigate("admin/study-list"),
    },
    {
      label: "Especialidades",
      icon: "pi pi-bullseye",
      command: () => void navigate("admin/speciality-list"),
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
      command: () => void navigate("clinic/history-appointment"),
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
      label: "Perfil",
      icon: "pi pi-user",
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

  const renderDoctorEnd = () => (
    <div className="flex flex-wrap align-items-center">
      <Dropdown
        value={clinicSelected}
        onChange={handleClinicChange}
        options={clinicOptions}
        optionLabel="name"
        placeholder="Select a Clinic"
        className="m-1 mr-2 w-14rem"
      />

      <Menu model={profileItems} popup ref={profileMenu} />
      <Button
        label={(userName ?? "P")[0]}
        className="m-1 py-1 px-3"
        severity="secondary"
        text
        onClick={event => profileMenu.current?.toggle(event)}
        aria-controls="profile-menu"
        aria-haspopup
      />
    </div>
  )

  const end =
    userType === USER_TYPES.DOCTOR ? (
      renderDoctorEnd()
    ) : (
      <div className="flex flex-wrap align-items-center">
        <Menu model={profileItems} popup ref={profileMenu} />
        <Button
          label={(userName ?? "P")[0]}
          className="m-1 py-1 px-3"
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
