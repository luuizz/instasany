import { StarRating } from '@/components/ui/star-rating'
import { formatDate } from '@/lib/dates'
import type { ReviewSummary } from '@/types/lms'

// Avaliações dos alunos na página do curso
export function CourseReviews({ summary }: { summary: ReviewSummary }) {
  if (summary.count === 0) return null
  return (
    <section aria-labelledby="avaliacoes" className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="avaliacoes" className="text-2xl font-semibold text-ink">
          O que dizem os alunos
        </h2>
        <p className="flex items-center gap-3 text-ink/70">
          <span className="text-3xl font-semibold text-ink tabular-nums">
            {summary.average.toFixed(1).replace('.', ',')}
          </span>
          <StarRating value={summary.average} className="text-pine" starClassName="size-5 fill-pine text-pine" />
          <span className="text-sm">
            {summary.count} {summary.count === 1 ? 'avaliação' : 'avaliações'}
          </span>
        </p>
      </div>
      {summary.latest.length > 0 && (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {summary.latest.map((review, index) => (
            <li key={index} className="flex flex-col gap-3 rounded-3xl border border-ink/10 bg-card p-6">
              <StarRating value={review.rating} starClassName="fill-pine text-pine" />
              <p className="flex-1 text-ink/80">{review.comment}</p>
              <p className="text-sm text-ink/50">
                <span className="font-semibold text-ink">{review.name}</span> · {formatDate(review.updatedAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
