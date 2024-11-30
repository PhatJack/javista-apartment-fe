import { useEffect, useRef, useState } from 'react'
import bg1 from '@/assets/background/bg-1.jpg'
import bg2 from '@/assets/background/bg-2.jpg'
import bg3 from '@/assets/background/bg-3.jpg'
import bg4 from '@/assets/background/bg-4.jpg'
import BreadCrumb from '@components/breadcrumb'
import DefaultAvatar from '@/assets/default-avatar.jpeg'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { z } from 'zod'
import { MessageSchema } from '@/schema/message.validate'
import { FieldErrors, useForm } from 'react-hook-form'
import {
  addDoc,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '@/firebase'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import Messages from '@/components/chat/messages'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { useDocumentTitle } from 'usehooks-ts'
import { useAppSelector } from '@/store'

interface Theme {
  id: string
  name: string
  src: string
  color?: string
}

const themes = [
  { id: 'white', name: 'Default White', src: 'white' },
  { id: 'bg1', name: 'Theme 1', src: bg1, color: '#ffcf7a' },
  { id: 'bg2', name: 'Theme 2', src: bg2, color: '#9cd0db' },
  { id: 'bg3', name: 'Theme 3', src: bg3, color: '#cdbef7' },
  { id: 'bg4', name: 'Theme 4', src: bg4, color: '#c5ebfe' },
]
const Index = () => {
  useDocumentTitle('Chat')

  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('selectedTheme')
    return savedTheme ? JSON.parse(savedTheme) : themes[0]
  })

  const changeTheme = (id: string) => {
    const selectedTheme = themes.find((theme) => theme.id === id)
    if (selectedTheme) {
      setTheme(selectedTheme)
      localStorage.setItem('selectedTheme', JSON.stringify(selectedTheme))
    }
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme')
    if (savedTheme) {
      setTheme(JSON.parse(savedTheme))
    }
  }, [])
  const user = useAppSelector((state) => state.userReducer.user)
  const [messages, setMessages] = useState<z.infer<typeof MessageSchema>[]>([])
  const msgContainerRef = useRef<HTMLDivElement>(null)
  const form = useForm<z.infer<typeof MessageSchema>>({
    defaultValues: {
      text: '',
    },
  })
  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    if (data.text.length === 0) {
      return
    }
    const messagesRef = collection(db, `conversations/${user?.id}/messages`)
    const messageDocRef = await addDoc(messagesRef, {
      senderId: 1,
      timestamp: serverTimestamp(),
      text: data.text,
    })
    form.reset({ text: '' })
    form.setFocus('text')

    // Reference to the conversation document
    const conversationRef = doc(db, `conversations/${user?.id}`)

    // Update the conversation docume
    await updateDoc(conversationRef, {
      is_admin_seen: false,
      is_resident_seen: true,
      last_message: messageDocRef,
      last_messaage_timestamp: serverTimestamp(), // Optional: Update timestamp to the current time
    })
  }
  const onError = (error: FieldErrors<z.infer<typeof MessageSchema>>) => {
    if (error.text) {
      console.log(error.text.message)
    }
  }

  useEffect(() => {
    const messagesRef = collection(db, `conversations/${user?.id}/messages`)
    const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(50))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages: z.infer<typeof MessageSchema>[] = []
      snapshot.forEach((doc) => {
        messages.push(doc.data() as z.infer<typeof MessageSchema>)
      })
      setMessages(messages)
    })
    return () => unsubscribe()
  }, [user])
  useEffect(() => {
    if (msgContainerRef.current) {
      msgContainerRef.current.scrollTo({
        top: msgContainerRef.current.scrollHeight,
        behavior: 'smooth', // This adds smooth scroll behavior
      })
    }
  }, [messages])

  return (
    <div className="w-full h-dvh flex flex-col bg-zinc-100 overflow-hidden">
      <BreadCrumb paths={[{ label: 'chat', to: '/chat' }]} />
      <div className="w-full h-full p-4 flex gap-4 overflow-hidden">
        <div className="w-full h-full flex flex-col rounded-md overflow-hidden border">
          <div className="w-full flex justify-between items-center p-4 shadow-md bg-white">
            <div className="flex items-center gap-2">
              <Avatar className="size-12">
                <AvatarImage src={DefaultAvatar} />
                <AvatarFallback>ADMIN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col font-medium">
                <h2>Admin</h2>
                <p className="text-xs text-green-400">Online</p>
              </div>
            </div>

            {/* Theme selection using ShadCN/UI Select component */}
            <Select onValueChange={changeTheme} defaultValue={theme.id}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                {themes.map((theme) => (
                  <SelectItem key={theme.id} value={theme.id}>
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div
            style={{
              backgroundColor: theme.src === 'white' ? 'white' : undefined,
              backgroundImage:
                theme.src !== 'white'
                  ? `linear-gradient(to bottom, rgba(255,255,255, 0.2), rgba(0, 0, 0, 0.1)), url(${theme?.src})`
                  : undefined,
              backgroundSize: 'cover',
            }}
            className="size-full px-4 overflow-hidden transition-all">
            <div
              ref={msgContainerRef}
              className="size-full flex flex-col overflow-y-auto gap-2">
              <Messages messages={messages} />
            </div>
          </div>
          <Separator />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="p-4 flex gap-4 bg-white">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem className="space-y-0 w-full">
                    <FormLabel className="sr-only">Message</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Type your message here...."
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button className="gap-2" type="submit">
                Send
                <Send />
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Index
