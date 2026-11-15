import { Skeleton } from '@/components/ui/skeleton'

// Enquanto a página do painel carrega: título e uma grade de cards
export default function AdminLoading() {
  return (
    <div aria-busy aria-label="Carregando" className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-9 w-64 rounded-2xl" />
        <Skeleton className="h-5 w-96 max-w-full rounded-xl" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} className="h-48 rounded-3xl" />
        ))}
      </div>
    </div>
  )
}
