import { cloneElement } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from '../ui/alert-dialog'

type AlertProps = {
  className?: string
  style?: React.CSSProperties
  trigger: React.ReactElement
  title: string
  description?: string
  okText?: string
  cancelText?: string
  onCancel?: () => void
  onOk?: () => void
}

export default function Alert({
  className,
  style,
  trigger,
  title,
  description,
  okText,
  cancelText,
  onCancel,
  onOk,
}: AlertProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>{cloneElement(trigger)}</AlertDialogTrigger>
      <AlertDialogContent className={className} style={style}>
        <AlertDialogHeader>
          <AlertDialogHeader>{title}</AlertDialogHeader>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              onCancel?.()
            }}
          >
            {cancelText ?? 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onOk?.()
            }}
          >
            {okText ?? 'Continue'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
