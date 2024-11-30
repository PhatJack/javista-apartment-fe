import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useGetUsersInScrollQuery } from '@/features/user/userSlice'
import { Loader2 } from 'lucide-react'
import { memo, useEffect, useRef, useState } from 'react'
import DefaultAvatar from '@/assets/default-avatar.jpeg'
import { useNavigate, useParams } from 'react-router-dom'

const ChatList = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(15)
  const { data, isLoading, isFetching } = useGetUsersInScrollQuery({
    page: currentPage,
    pageSize: pageSize,
  })

  const handleScroll = () => {
    if (!chatContainerRef.current || isFetching) return

    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
    const scrollThreshold = 20
    const isNearBottom =
      scrollHeight - (scrollTop + clientHeight) <= scrollThreshold
    // console.log(isNearBottom)
    if (isNearBottom && data?.data.length != data?.totalElements) {
			console.log(data)
      console.log('Fetching more data')
      setCurrentPage((prev) => prev + 1)
      setPageSize(5)
    }
  }

  // Add scroll event listener
  useEffect(() => {
    const chatContainer = chatContainerRef.current
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll)
      return () => {
        chatContainer.removeEventListener('scroll', handleScroll)
        // Clear any existing timeout on cleanup
      }
    }
  }, [isFetching])

  return (
    <div
      ref={chatContainerRef}
      className="h-full flex flex-col gap-1 overflow-y-auto">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className='animate-spin text-primary' />
        </div>
      ) : (
        data?.data.map((user, index) => (
          <div
            key={index}
            onClick={() => navigate(`/admin/chat/${user.id}`)}
            className={`w-full rounded-md h-fit flex items-center gap-2 px-2 py-3 hover:bg-zinc-200 transition-all cursor-pointer ${Number(id) === user.id ? "bg-primary" : ""}`}>
            <Avatar>
              <AvatarImage src={user.avatar ?? DefaultAvatar} />
              <AvatarFallback>
                AVT
              </AvatarFallback>
            </Avatar>
            <div className="w-full h-full grid grid-cols-[1fr_40px]">
              <p className="text-sm font-bold">{user.fullName}</p>
              <span className="size-2 rounded-full bg-green-500"></span>
              <p className={`text-xs truncate w-[90%] ${Number(id) === user.id ? "text-black" : "text-gray-500"}`}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                nec feugiat nunc. Nam nec.
              </p>
              <p className={`text-xs ${Number(id) === user.id ? "text-black" : "text-gray-400"}`}>12:00</p>
            </div>
          </div>
        ))
      )}
      {isFetching && (
        <div className="py-2 text-center flex justify-center">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      )}
    </div>
  )
}

export default memo(ChatList)
