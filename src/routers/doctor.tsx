import type { RouteObject } from "react-router"
import {
  CreateAppointment,
  DetailAppointment,
  DetailPatient,
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
        path: "create",
        element: <CreateAppointment />,
      },
    ],
  },
  {
    path: "doctor/patient-list",
    children: [
      {
        index: true,
        element: <ListPatient />,
      },
      {
        path: ":idPatient",
        element: <DetailPatient />,
      },
    ],
  },
  {
    path: "doctor/profile",
    element: <Profile />,
  },
]

export { DoctorRouter }
