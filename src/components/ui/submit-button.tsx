import { Button } from './button'
import { Spinner } from './spinner'

type SubmitButtonProps = React.ComponentProps<typeof Button> & { pending?: boolean; pendingLabel?: string }

// Botão de envio com indicador de carregamento enquanto a Server Action roda
export function SubmitButton({ children, pending = false, pendingLabel, size = 'lg', ...props }: SubmitButtonProps) {
  return (
    <Button type="submit" size={size} disabled={pending} aria-busy={pending} {...props}>
      {pending && <Spinner />}
      {pending ? (pendingLabel ?? 'Enviando…') : children}
    </Button>
  )
}
