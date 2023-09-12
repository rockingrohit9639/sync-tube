'use client'

import { cloneElement } from 'react'
import { Slot } from '@radix-ui/react-slot'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

type DropdownProps = {
  children: React.ReactElement
  label?: string | null
  items: Array<{ id: string; label: React.ReactNode; onClick?: () => void }>
}

export default function Dropdown({ children, label, items }: DropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{cloneElement(children)}</DropdownMenuTrigger>
      <DropdownMenuContent>
        {label ? (
          <>
            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        ) : null}
        {items.map((item) => (
          <Slot
            key={item.id}
            onClick={() => {
              item.onClick?.()
            }}
            className="cursor-pointer"
          >
            <DropdownMenuItem>{item.label}</DropdownMenuItem>
          </Slot>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
