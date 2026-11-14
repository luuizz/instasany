import { signOut } from '@/app/(auth)/actions'
import { cn } from '@/lib/utils'

export function SignOutButton({ className }: { className?: string }) {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className={cn('cursor-pointer font-semibold underline-offset-4 hover:underline', className)}
      >
        Sair
      </button>
    </form>
  )
}
