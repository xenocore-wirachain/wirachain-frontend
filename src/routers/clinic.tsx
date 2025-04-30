import { Navigate } from "react-router"
import ListClinic from "../pages/clinic/clinic/ListClinic"
import ListDoctor from "../pages/clinic/doctor/ListDoctor"
import HistoryAppoinment from "../pages/clinic/HistoryAppoinment"
import Profile from "../pages/clinic/Profile"
import ListSpecialty from "../pages/clinic/speciality/ListSpecialty"
import Stadistics from "../pages/clinic/Stadistics"
import ListStudy from "../pages/clinic/study/ListStudy"

const ClinicRouter = [
  {
    path: "",
    element: <Navigate replace to="/dashboard/clinic-list" />,
  },
  {
    path: "clinic-list",
    element: <ListClinic />,
  },
  {
    path: "doctor-list",
    element: <ListDoctor />,
  },
  {
    path: "speciality-list",
    element: <ListSpecialty />,
  },
  {
    path: "study-list",
    element: <ListStudy />,
  },
  {
    path: "history-appointment",
    element: <HistoryAppoinment />,
  },
  {
    path: "stadistics",
    element: <Stadistics />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
]

export { ClinicRouter }
