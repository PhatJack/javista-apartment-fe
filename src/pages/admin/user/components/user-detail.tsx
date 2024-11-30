import { useGetUserByIdQuery } from '@/features/user/userSlice'
import UserDetailForm from './components/user-detail-form'
import { Loader } from 'lucide-react'

interface UserDetailProps {
  showDetail: string | number | null
  setShowDetail: (value: string | number | null) => void
}

const UserDetail = ({ showDetail, setShowDetail }: UserDetailProps) => {
  const {
    data: user,
    isLoading,
    isFetching,
  } = useGetUserByIdQuery(showDetail as string, {
    skip: !showDetail,
  })

  return (
    <div
      className={`fixed top-0 left-0 w-full h-screen z-50 flex justify-center items-center p-4`}>
      <div
        onClick={() => setShowDetail(null)}
        className="w-full h-screen absolute animate-in fade-in inset-0 bg-gradient-to-b from-black/20 to-black/60"></div>
      {isLoading || isFetching ? (
        <div className="w-[512px] h-[484px] rounded-lg bg-white flex justify-center items-center relative z-[51]">
          <Loader className="animate-spin text-primary" size={52} />
        </div>
      ) : (
        <UserDetailForm user={user} setShowDetail={setShowDetail} />
      )}
    </div>
  )
}

export default UserDetail
