import { ROUTES } from '@/configs/endpoint'
import { UserRole } from '@/enums'
import { useAppSelector } from '@/store'
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const ProtectedLayout: React.FC<{ userType: UserRole }> = ({ userType }) => {
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.userReducer.user)
  const location = useLocation()
  useEffect(() => {
    if (user && user.userType !== userType) {
      const redirectPath =
        user.userType === 'ADMIN' ? ROUTES.ADMIN.HOME : ROUTES.HOME
      navigate(redirectPath)
      toast.error('You are not authorized to access this page')
    } else {
      if (
        user?.relationships && user.relationships[0]?.role !== 'OWNER' &&
        location.pathname !== ROUTES.BILLS
      ) {
        navigate(ROUTES.BILLS)
        toast.error('You are not authorized to access this page')
      }
    }
  }, [navigate, user, userType])

  return <Outlet />
}

export default ProtectedLayout
