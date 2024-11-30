import { useEffect, useState } from 'react'
import Overlay from '@/components/overlay/Overlay'
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'
import { useAppDispatch } from '@/store'
import { userLoggedOut } from '@/features/auth/authSlice'

const IsHouseDisrupted = () => {
  const [countdown, setCountdown] = useState(5)
  const navigate = useNavigate()
  const cookies = new Cookies(null, { path: '/' })
  const dispatch = useAppDispatch()

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer)
          cookies.remove('token')
          dispatch(userLoggedOut())
          navigate('/login')
          return 0
        }
        return prevCountdown - 1
      })
    }, 1000)

    // Cleanup the interval on component unmount
    return () => clearInterval(timer)
  }, [navigate])

  return (
    <Overlay className="backdrop-blur-md">
      <div className="w-[500px] p-4 bg-white rounded-md flex flex-col space-y-2 relative overflow-hidden">
        <p className="text-2xl text-primary font-bold">House disruption</p>
        <p className="text-zinc-500 font-medium">
          Your house is currently disrupted due to unpaid bills. Please pay your bills to avoid
          further action.
        </p>
        <div className="text-primary font-medium text-base">
          Redirecting to <b className="text-primary">Login</b> in {countdown} seconds
        </div>
      </div>
    </Overlay>
  )
}

export default IsHouseDisrupted
