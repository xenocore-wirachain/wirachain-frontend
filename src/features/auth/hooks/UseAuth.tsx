import {
  selectCurrentUser,
  selectIsAuthenticated,
  useAppSelector,
} from "../../../redux"

export const useAuth = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const user = useAppSelector(selectCurrentUser)

  return {
    isAuthenticated,
    userId: user?.id,
    userName: user?.name,
    userType: user?.user_type,
    user: user,
  }
}
