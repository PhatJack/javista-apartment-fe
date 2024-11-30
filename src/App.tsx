import { RouterProvider } from 'react-router-dom'
import route from './routes/route'
import 'react-day-picker/dist/style.css'
import { useEffect } from 'react'
import Cookies from 'universal-cookie'
import { getUserInformation, useLazyGetCurrentUserQuery } from './features/user/userSlice'
import { useAppDispatch } from './store'
import { userLoggedIn } from './features/auth/authSlice'
import { useLazyGetRelationshipsQuery } from './features/relationships/relationshipsSlice'
function App() {
  const cookie = new Cookies(null, { path: '/' })
  const dispatch = useAppDispatch()
  const [getCurrentUser, { data: user }] = useLazyGetCurrentUserQuery()
  const [getRelationships] = useLazyGetRelationshipsQuery()
  useEffect(() => {
    const handleGetCurrentUser = async () => {
      if (cookie.get('accessToken')) {
        dispatch(
          userLoggedIn({
            token: cookie.get('accessToken'),
          }),
        )
        await getCurrentUser()
          .unwrap()
          .then(async (payloadUser) => {
            await getRelationships({ userId: payloadUser.id, page: 1 })
              .unwrap()
              .then((payload) => {
                dispatch(getUserInformation({ ...payloadUser, relationships: payload.data }))
              })
          })
          .catch((error) => {
            throw new Error("can't get user information")
          })
      }
    }
    handleGetCurrentUser()
  }, [])

  return <RouterProvider router={route} />
}

export default App
