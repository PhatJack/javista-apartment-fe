import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BillStatus } from '@/enums'
import { Label } from '@/components/ui/label'
import { useDebounceCallback } from 'usehooks-ts'

export interface FilterValues {
  id?: number
  monthly?: string
  status?: BillStatus
}

interface FilterPanelProps {
  isOpen: boolean
  onApplyFilters: (filters: FilterValues) => void
}

const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onApplyFilters }) => {
  // Separate state for the debounced ID input
  const [idInput, setIdInput] = useState<string>('')

  const [filters, setFilters] = useState<FilterValues>({
    id: undefined,
    monthly: undefined,
    status: undefined,
  })

  // Debounced handler for ID input
  const debouncedSetId = useDebounceCallback(
    (value: string) => {
      setFilters((prev) => ({
        ...prev,
        id: value ? parseInt(value) : undefined,
      }))
    },
    500, // 500ms delay
  )

  // Handle ID input changes with debounce
  const handleIdChange = (value: string) => {
    setIdInput(value) // Update the input value immediately for UI
    debouncedSetId(value) // Debounce the actual filter update
  }

  // Handle other filter changes immediately
  const handleFilterChange = (field: keyof FilterValues, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleApplyFilters = () => {
    onApplyFilters(filters)
  }

  const handleReset = () => {
    setIdInput('') // Reset the ID input state
    const resetFilters: FilterValues = {
      id: undefined,
      monthly: undefined,
      status: undefined,
    }
    setFilters(resetFilters)
    onApplyFilters(resetFilters)
  }

  if (!isOpen) return null

  return (
    <div className="w-full bg-white border rounded-md p-4 space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Bill ID</label>
          <Input
            type="number"
            placeholder="Filter by ID"
            value={idInput}
            onChange={(e) => handleIdChange(e.target.value)}
            min={0}
            step={1}
          />
        </div>
        <div className="space-y-2">
          <Label>Current Monthly</Label>
          <Input
            type="month"
            value={filters.monthly}
            onChange={(e) => handleFilterChange('monthly', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value: BillStatus) => handleFilterChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PAID">PAID</SelectItem>
              <SelectItem value="OVERDUE">OVERDUE</SelectItem>
              <SelectItem value="UNPAID">UNPAID</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={handleReset}>
          Reset
        </Button>
        <Button onClick={handleApplyFilters}>Apply Filters</Button>
      </div>
    </div>
  )
}

export default FilterPanel
