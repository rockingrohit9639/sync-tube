import React from 'react'

type WhenProps = {
  truthy: boolean
  elseElement?: React.ReactNode | null
}

export default function When({ children, truthy, elseElement }: React.PropsWithChildren<WhenProps>) {
  return truthy ? children : elseElement ?? null
}
