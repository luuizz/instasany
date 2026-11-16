import { CheckIcon } from 'lucide-react'

const options = ['Comprar seguidores', 'Definir o seu nicho', 'Postar sem parar']
const CORRECT = 1

// Prévia ilustrativa do quiz: a alternativa certa é marcada e o resultado aparece
export function MockQuiz() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-paper p-4 text-ink shadow-xl shadow-ink/20">
      <p className="text-2xs font-semibold tracking-widest text-sage uppercase">Quiz · Módulo 1</p>
      <p className="text-sm font-semibold">Qual o primeiro passo para crescer no Instagram?</p>
      <ul className="flex flex-col gap-1.5">
        {options.map((option, index) => (
          <li
            key={option}
            data-anim={index === CORRECT ? 'answer' : 'option'}
            className="relative flex items-center gap-2 overflow-hidden rounded-xl bg-secondary/70 px-3 py-2 text-xs"
          >
            {index === CORRECT && <span data-anim="answer-fill" className="absolute inset-0 origin-left bg-lime" />}
            <span className="relative flex size-4 shrink-0 items-center justify-center rounded-full bg-paper ring-1 ring-ink/15">
              {index === CORRECT && <CheckIcon data-anim="answer-check" className="size-3 text-pine" strokeWidth={3} />}
            </span>
            <span className="relative">{option}</span>
          </li>
        ))}
      </ul>
      <p data-anim="score" className="self-start rounded-full bg-pine px-3 py-1 text-2xs font-semibold text-lime">
        Aprovado · 3 de 3
      </p>
    </div>
  )
}
