'use client'

import { useRef } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog'

type ConfirmDialogProps = {
  title: string
  description?: string
  confirmLabel?: string
  destructive?: boolean
  onConfirm: () => void
  children: React.ReactElement
}

// Confirmação no estilo do site (no lugar do window.confirm); children é o botão que abre
export function ConfirmDialog({
  title,
  description,
  confirmLabel = 'Confirmar',
  destructive,
  onConfirm,
  children,
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={
              destructive ? 'bg-destructive text-paper hover:bg-destructive/90 hover:brightness-100' : undefined
            }
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

type ConfirmButtonProps = Omit<React.ComponentProps<'button'>, 'type'> & {
  title: string
  description?: string
  confirmLabel?: string
}

// Botão dentro de um <form action>: confirma e só então envia o formulário
export function ConfirmButton({ title, description, confirmLabel = 'Excluir', ...props }: ConfirmButtonProps) {
  const button = useRef<HTMLButtonElement>(null)
  return (
    <ConfirmDialog
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      destructive
      onConfirm={() => button.current?.closest('form')?.requestSubmit()}
    >
      <button ref={button} type="button" {...props} />
    </ConfirmDialog>
  )
}
