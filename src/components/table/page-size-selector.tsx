import { memo } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface PageSizeSelectorProps {
  pageSize: number
  onPageSizeChange: (size: number) => void
  setCurrentPage: (size: number) => void
  options?: number[]
  className?: string
  label?: string
}

const PageSizeSelector = memo(
  ({
    pageSize,
    onPageSizeChange,
    setCurrentPage,
    options = [10, 15, 25, 35],
    className = '',
    label = 'Rows per page',
  }: PageSizeSelectorProps) => {
    return (
      <div className={cn('whitespace-nowrap flex items-center gap-2', className)}>
        {label && <p className="text-sm text-gray-600">{label}</p>}
        <Select
          value={String(pageSize)}
          onValueChange={(value) => {
            onPageSizeChange(parseInt(value))
            setCurrentPage(1)
          }}>
          <SelectTrigger className="w-16 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    )
  },
)

PageSizeSelector.displayName = 'PageSizeSelector'

export default PageSizeSelector
