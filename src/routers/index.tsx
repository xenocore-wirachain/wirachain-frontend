import { createBrowserRouter } from "react-router"
import Login from "../features/auth/Login"
import Register from "../features/auth/Register"
import ResetPassword from "../features/auth/ResetPassword"
import BodyDashboard from "../layouts/BodyDashboard"
import NotFound from "../pages/NotFound"
import { AdminRouter } from "./admin"

// TODO: add a path of resetpassword with is protectect and to unlockit you have to get as valid the token
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/reset-pass",
    element: <ResetPassword />,
  },
  {
    path: "/dashboard",
    element: <BodyDashboard />,
    children: AdminRouter,
  },
  {
    path: "*",
    element: <NotFound />,
  },
])

export { router }
