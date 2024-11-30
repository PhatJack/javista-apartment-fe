import { Outlet, Navigate, useLocation } from 'react-router-dom'
import Cookies from 'universal-cookie'
const PrivateRoute = () => {
  const cookies = new Cookies(null, { path: '/' })
  const token = cookies.get('accessToken')
  const location = useLocation()

  return (
    <>
      {!token ? (
        <Navigate to="/login" state={{ from: location.pathname }} />
      ) : (
        <Outlet />
      )}
    </>
  )
}

export default PrivateRoute
