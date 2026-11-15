import { LogOutIcon } from 'lucide-react'
import { signOut } from '@/app/(auth)/actions'
import { Button } from '@/components/ui/button'

type SignOutButtonProps = { className?: string; withIcon?: boolean }

export function SignOutButton({ className, withIcon }: SignOutButtonProps) {
  return (
    <form action={signOut}>
      <Button type="submit" variant="link" className={className}>
        {withIcon && <LogOutIcon />}
        Sair
      </Button>
    </form>
  )
}
