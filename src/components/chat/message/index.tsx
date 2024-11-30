import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Timestamp } from '@firebase/firestore-types'
import { useAppSelector } from '@/store'
import { useGetUserByIdQuery } from '@/features/user/userSlice'

interface MessageProps {
  senderId: number
  text: string
  timestamp: Timestamp
}
const Index = ({ senderId, text, timestamp }: MessageProps) => {
  const user = useAppSelector((state) => state.userReducer.user)
  const { data: userSend } = useGetUserByIdQuery(senderId, {
    skip: !senderId,
  })
  return (
    <div
      className={`grid gap-x-3 gap-y-1 w-full ${
        senderId !== user?.id
          ? 'place-items-end grid-cols-[1fr_auto]'
          : 'place-items-start grid-cols-[auto_1fr]'
      }`}>
      <div
        className={`${
          senderId !== user?.id
            ? 'col-start-1 row-start-1'
            : 'col-start-2 row-start-1'
        } text-sm leading-tight`}>
        {/* {senderId !== user?.id ? `${user?.fullName}` : `${userSend?.fullName}`}{' '} */}
        <span className="text-xs  opacity-70">
          {timestamp?.toDate()?.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          })}
        </span>
      </div>
      <p
        className={`w-fit p-2 rounded-md text-base relative ${
          senderId !== user?.id
            ? 'bg-primary col-start-1 text-white'
            : 'bg-zinc-200 col-start-2 text-black'
        }`}>
        <span
          className={`size-2.5 absolute top-[calc(50%-0.25rem)] ${
            senderId !== user?.id
              ? '[clip-path:polygon(100%_50%,_0%_100%,_0%_0%)] bg-primary -right-2'
              : '[clip-path:polygon(0%_50%,_100%_0%,_100%_100%)] bg-zinc-200 -left-2'
          }`}></span>
        {text}
      </p>
      {/* <div
        className={`text-sm opacity-70 flex gap-1 items-center ${
          senderId !== user?.id
            ? 'col-start-1 row-start-1'
            : 'col-start-2 row-start-1'
        }}`}>
        <CheckCheck size={16} /> seen at 12:45
      </div> */}
    </div>
  )
}

export default Index
