'use client'

import React, { cloneElement } from 'react'
import { Slot } from '@radix-ui/react-slot'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

type DropdownItem = {
  id: string
  label: React.ReactNode
  onClick?: () => void
  icon?: React.ReactElement<{ className?: string }>
}

type DropdownProps = {
  className?: string
  style?: React.CSSProperties
  children: React.ReactElement
  label?: string | null
  items: Array<DropdownItem>
}

export default function Dropdown({ className, style, children, label, items }: DropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{cloneElement(children)}</DropdownMenuTrigger>
      <DropdownMenuContent className={className} style={style}>
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
            <DropdownMenuItem className="flex items-center justify-between gap-4">
              <div>{item.label}</div>
              {typeof item.icon !== 'undefined' ? cloneElement(item.icon, { className: 'w-4 h-4 opacity-80' }) : null}
            </DropdownMenuItem>
          </Slot>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
