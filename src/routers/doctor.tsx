import type { RouteObject } from "react-router"
import {
  CreateAppointment,
  DetailAppointment,
  ListAppointment,
  ListPatient,
  Profile,
} from "../features/doctor"

const DoctorRouter: RouteObject[] = [
  {
    path: "doctor/appointment-list",
    children: [
      {
        index: true,
        element: <ListAppointment />,
      },
      {
        path: ":idAppointment",
        element: <DetailAppointment />,
      },
      {
        path: "/crear",
        element: <CreateAppointment />,
      },
    ],
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
