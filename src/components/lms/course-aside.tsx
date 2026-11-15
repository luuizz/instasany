import { saveReviewAction } from '@/app/(aluno)/aluno/course-actions'
import { ReviewForm } from '@/components/courses/review-form'
import { certificateCodeFor } from '@/server/services/certificates'
import { getMyReview } from '@/server/services/reviews'
import type { CourseCompletion, CourseOutline } from '@/types/lms'
import { CourseFinishCard } from './course-finish-card'
import { LessonSidebar } from './lesson-sidebar'

type CourseAsideProps = {
  course: CourseOutline
  profileId: string
  completed: number[]
  passedQuizzes: number[]
  currentId?: number
  currentQuiz?: number
}

// Lateral da aula e do quiz: lista de aulas, certificado e avaliação do curso
export async function CourseAside({
  course,
  profileId,
  completed,
  passedQuizzes,
  currentId,
  currentQuiz,
}: CourseAsideProps) {
  const lessonsTotal = course.modules.reduce((total, module) => total + module.lessons.length, 0)
  const quizzesTotal = course.modules.filter((module) => module.quizQuestions > 0).length
  const completion: CourseCompletion = {
    lessonsDone: completed.length,
    lessonsTotal,
    quizzesPassed: passedQuizzes.length,
    quizzesTotal,
    complete: lessonsTotal > 0 && completed.length === lessonsTotal && passedQuizzes.length === quizzesTotal,
  }
  const [certificateCode, myReview] = await Promise.all([
    certificateCodeFor(profileId, course.id),
    getMyReview(profileId, course.id),
  ])

  return (
    <aside className="flex flex-col gap-6">
      <LessonSidebar
        course={course}
        completed={completed}
        passedQuizzes={passedQuizzes}
        currentId={currentId}
        currentQuiz={currentQuiz}
      />
      <CourseFinishCard slug={course.slug} completion={completion} certificateCode={certificateCode} />
      {completed.length > 0 && (
        <section aria-labelledby="avaliacao" className="rounded-3xl border border-ink/10 p-5">
          <h2 id="avaliacao" className="mb-4 font-semibold">
            {myReview ? 'Sua avaliação do curso' : 'O que está achando do curso?'}
          </h2>
          <ReviewForm initial={myReview} save={saveReviewAction.bind(null, course.id, course.slug)} />
        </section>
      )}
    </aside>
  )
}
