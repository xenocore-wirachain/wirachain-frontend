import { Navigate } from "react-router"
import { ListAppointment, ListPatient, Profile } from "../features/doctor"

const DoctorRouter = [
  {
    path: "",
    element: <Navigate replace to="/dashboard/appointment-list" />,
  },
  {
    path: "appointment-list",
    element: <ListAppointment />,
  },
  {
    path: "patient-list",
    element: <ListPatient />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
]

export { DoctorRouter }
