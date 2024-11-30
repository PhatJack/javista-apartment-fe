'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'

import { cn } from '@/lib/utils'

interface CustomProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  classNameIndicator?: string
  backgroundColorIndicator?: string
}
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  CustomProgressProps
>(
  (
    {
      className,
      value,
      classNameIndicator,
      backgroundColorIndicator,
      ...props
    },
    ref,
  ) => (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
        className,
      )}
      {...props}>
      <ProgressPrimitive.Indicator
        className={cn(
          `h-full w-full flex-1 transition-all`,
          classNameIndicator,
        )}
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          backgroundColor: backgroundColorIndicator,
        }}
      />
    </ProgressPrimitive.Root>
  ),
)
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
