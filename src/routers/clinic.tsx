import type { RouteObject } from "react-router"
import {
  DetailAppointment,
  HistoryAppoinment,
  ListClinic,
  ListDoctor,
  Profile,
  Stadistics,
} from "../features/clinic"

const ClinicRouter: RouteObject[] = [
  {
    path: "clinic/clinic-list",
    element: <ListClinic />,
  },
  {
    path: "clinic/doctor-list",
    element: <ListDoctor />,
  },
  {
    path: "clinic/history-appointment",
    children: [
      {
        index: true,
        element: <HistoryAppoinment />,
      },
      {
        path: ":idAppointment",
        element: <DetailAppointment />,
      },
    ],
  },
  {
    path: "clinic/stadistics",
    element: <Stadistics />,
  },
  {
    path: "clinic/profile",
    element: <Profile />,
  },
]

export { ClinicRouter }
