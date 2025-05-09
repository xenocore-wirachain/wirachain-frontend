import type { RouteObject } from "react-router"
import {
  HistoryAppoinment,
  ListClinic,
  Profile,
  Stadistics,
} from "../features/clinic"

const ClinicRouter: RouteObject[] = [
  {
    path: "clinic/clinic-list",
    element: <ListClinic />,
  },
  // {
  //   path: "clinic/doctor-list",
  //   element: <ListDoctor />,
  // },
  {
    path: "clinic/history-appointment",
    element: <HistoryAppoinment />,
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
