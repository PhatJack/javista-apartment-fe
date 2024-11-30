import { ROUTES } from '@/configs/endpoint'
import { ApartmentUserRole } from '@/enums'
import { useAppSelector } from '@/store'
import { useEffect } from 'react'
import { matchPath, Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const UserLayout = () => {
  const token = useAppSelector((state) => state.authReducer.token)
  const user = useAppSelector((state) => state.userReducer.user)
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) return

    if (user) {
      const { userType, relationships } = user

      // Helper function to check if any relationship has a specific role
      const hasRole = (role: ApartmentUserRole) =>
        relationships?.some((relationship) => relationship.role === role)

      if (userType === 'RESIDENT') {
        if (hasRole('OWNER') && !hasRole('TENANT')) {
          if (
            !matchPath({ path: '/bills/:id?', end: true }, location.pathname) &&
            location.pathname !== ROUTES.HOME
          ) {
            navigate(ROUTES.HOME)
            toast.error('You are not authorized to access this page.123')
          }
        }
      } else {
        // Case: Not a RESIDENT
        navigate(ROUTES.ADMIN.HOME)
        toast.error('You are not authorized to access this page.')
      }
    }
  }, [navigate, user, token])

  return <Outlet />
}

export default UserLayout
