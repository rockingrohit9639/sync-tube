'use client'

import { CalendarIcon } from 'lucide-react'
import dayjs from 'dayjs'
import React from 'react'
import { cn } from '~/lib/utils/utils'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Calendar, CalendarProps } from '../ui/calendar'

export type DatePickerProps = Omit<CalendarProps, 'onSelect'> & {
  className?: string
  style?: React.CSSProperties
  onChange?: (date: Date | undefined) => void
  placeholder?: string
}

export default function DatePicker({ className, style, onChange, placeholder, ...props }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn('w-[280px] justify-start text-left font-normal', !date && 'text-muted-foreground')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? dayjs(date).format('MMM DD, YYYY') : <span>{placeholder ?? 'Pick a date'}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-auto p-0', className)} style={style}>
        <Calendar
          {...props}
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            setDate(selectedDate)
            onChange?.(selectedDate)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
