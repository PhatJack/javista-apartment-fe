import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import GridWallpaper from '@/assets/grid-wallpaper.jpg'
import { Separator } from '@/components/ui/separator'
import { memo } from 'react'
import { FormEvent, useEffect, useState } from 'react'
import Message from '@components/chat/message'
import { db } from '@/firebase'
import {
  addDoc,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import DefaultAvatar from '@/assets/default-avatar.jpeg'
import { useGetUserByIdQuery } from '@/features/user/userSlice'
import { useParams } from 'react-router-dom'
import Messages from '@/components/chat/messages'
import ChatSend from '@/components/chat/chat-submit/chat-send'
import { Skeleton } from '@/components/ui/skeleton'
interface Message {
  senderId: number
  text: string
  timestamp: Timestamp
}

const ChatContainer = () => {
  const { id } = useParams()
  const { data: user, isLoading } = useGetUserByIdQuery(id as string, {
    skip: !id,
  })
  const [messages, setMessages] = useState<Message[]>([])
  const [msg, setMsg] = useState<string>('')

  useEffect(() => {
    const messagesRef = collection(db, `conversations/${user?.id}/messages`)
    const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(50))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages: Message[] = []
      snapshot.forEach((doc) => {
        messages.push(doc.data() as Message)
      })
      setMessages(messages)
    })
    return () => unsubscribe()
  }, [user])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const messagesRef = collection(db, `conversations/${user?.id}/messages`)
    const messageDocRef = await addDoc(messagesRef, {
      senderId: user?.id,
      timestamp: serverTimestamp(),
      text: msg,
    })
    setMsg('')
    const conversationRef = doc(db, `conversations/${user?.id}`)
    await updateDoc(conversationRef, {
      is_admin_seen: false,
      is_resident_seen: true,
      last_message: messageDocRef,
      last_messaage_timestamp: serverTimestamp(),
    })
  }

  return (
    <div className="size-full flex flex-col">
      <header className="flex items-center gap-2 p-3 shadow-md relative z-20">
        {isLoading && <Skeleton className="w-full h-full bg-zinc-300" />}
        <Avatar>
          <AvatarImage src={user?.avatar ?? DefaultAvatar} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <p className="font-medium">{user?.fullName}</p>
      </header>

      <Separator />
      <div className="size-full relative bg-black">
        <img
          src={GridWallpaper}
          alt="grid wallpaper"
          className="size-full object-cover absolute inset-0 z-10"
        />
        <Messages messages={messages} />
      </div>

      <Separator />

      <ChatSend onSubmit={onSubmit} setMsg={setMsg} msg={msg} />
    </div>
  )
}

export default memo(ChatContainer)
