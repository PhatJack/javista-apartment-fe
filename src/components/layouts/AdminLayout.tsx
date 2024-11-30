import { ROUTES } from '@/configs/endpoint'
import { useAppSelector } from '@/store'
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const AdminLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAppSelector((state) => state.userReducer.user)

  useEffect(() => {
    // Return early if no user
    if (!user) return

    // Handle non-admin users
    if (user.userType !== 'ADMIN') {
      // Handle resident users
      if (user.userType === 'RESIDENT') {
        // Check if user is not owner and trying to access non-bills page
        const isNonOwnerAccessingRestrictedPage =
          user.relationships?.[0]?.role !== 'OWNER' && location.pathname !== ROUTES.BILLS

        if (isNonOwnerAccessingRestrictedPage) {
          navigate(ROUTES.BILLS)
        } else {
          navigate(ROUTES.HOME)
        }
      } else {
        // Handle other user types
        navigate(ROUTES.ADMIN.HOME)
      }

      toast.error('You are not authorized to access this page')
    }
  }, [user, navigate, location.pathname])

  return <Outlet />
}

export default AdminLayout
