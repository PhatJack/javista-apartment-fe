import { memo, useEffect, useRef } from 'react'
import Message from '../message'
import { MessageType } from '@/schema/message.validate'
interface MessagesProps {
  messages: MessageType[]
}

const Index = ({ messages }: MessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]) // Scroll when messages array changes

  return (
    <div className="w-full flex flex-col-reverse gap-2 h-full overflow-y-auto p-3 relative z-10">
      {messages.reverse().map((message, index) => (
        <Message {...message} key={index} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default memo(Index)
