import { createBrowserRouter } from "react-router"
import Login from "../pages/auth/Login"
import Register from "../pages/auth/Register"
import ResetPassword from "../pages/auth/ResetPassword"

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
])

export { router }
