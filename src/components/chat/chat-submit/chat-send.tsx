import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormEvent, memo } from 'react'

interface ChatSendProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  setMsg: (msg: string) => void
	msg: string
}

const ChatSend = ({ onSubmit, setMsg ,msg}: ChatSendProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full flex items-center gap-4 h-20 px-3 relative z-20 shadow-[0_-10px_15px_-3px_rgb(0,0,0,0.1)]">
      <Input
				type="text"
				value={msg}
        placeholder="Type a message"
        onChange={(e) => setMsg(e.target.value)}
      />
      <Button type="submit" className="px-4 py-2 rounded-md">
        Send
      </Button>
    </form>
  )
}

export default memo(ChatSend)
