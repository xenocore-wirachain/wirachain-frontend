import type { RouteObject } from "react-router"
import { ListAppointment, ListPatient, Profile } from "../features/doctor"

const DoctorRouter: RouteObject[] = [
  {
    path: "doctor/appointment-list",
    element: <ListAppointment />,
  },
  {
    path: "doctor/patient-list",
    element: <ListPatient />,
  },
  {
    path: "doctor/profile",
    element: <Profile />,
  },
]

export { DoctorRouter }
