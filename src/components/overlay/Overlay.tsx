import { cn } from '@/lib/utils'
import React from 'react'

interface Props {
  children: React.ReactNode
  className?: string
}

const Overlay = ({ children, className }: Props) => {
  return (
    <div
      className={cn(
        'size-full fixed inset-0 bg-black/50 z-50 animate-in fade-in',
        className,
      )}>
      <div className="size-full flex justify-center items-center">
        {children}
      </div>
    </div>
  )
}

export default Overlay
